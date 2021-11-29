import {Log, UserSession} from 'models';
import {verifyAccessToken} from 'helpers/authentication';
import * as fs from 'fs';
import {
    checkValidUserOfPropertyRequest,
    getPropertyMessages,
    saveMessage
} from 'data_stores/mongo_db/lib/property_request';
import {ROLE_LIST} from 'constants/master_data';
import {propertyChatDataMapping} from 'helpers/data_mapping/property_chat';
import {s3ConnectionLoader} from 'loaders/s3_config';
import {AWS_S3} from 'loaders/config';
import {getFileURL} from 'helpers/s3_media';

const TAG = 'loaders.socket';

export function initialiseSocket(io) {
    try {
        io.use(async (socket, next) => {
            Log.debug('Started Authenticating the web socket!');
            if (socket.handshake.auth.token || socket.handshake.query.token) {
                const token = socket.handshake?.auth?.token ?? socket.handshake?.query?.token;
                try {
                    const decode: any = verifyAccessToken(token);
                    const roleNames = decode.role.map((role) => role.name);
                    socket.handshake.query.userSession = new UserSession(decode.userId, decode.role, [], decode.name);
                    if (roleNames.indexOf(ROLE_LIST.SUPER_ADMIN.name) !== -1) {
                        next();
                    } else {
                        const validUser =
                            await checkValidUserOfPropertyRequest(socket.handshake.query.room, decode.userId);
                        if (validUser) {
                            next();
                        } else {
                            next(new Error('Access Forbidden!'));
                        }
                    }
                } catch (error) {
                    Log.error(TAG, 'socketAuthMiddleWare()', error);
                    next(new Error('Invalid Credentials!'));
                }
            } else {
                next(new Error('Invalid Credentials!'));
            }
        });

        io.on('connection', (socket) => {
            const chatID = socket.handshake.query.room;
            socket.join(chatID);

            socket.on('disconnect', () => {
                Log.debug('Disconnect');
                socket.leave(chatID);
            });

            socket.on('send_message', async (message) => {
                // const receiverChatID = message.receiverChatID;
                const propertyRequestId = message.propertyRequestId;
                const senderChatID = message.senderChatID;
                const content = message.content;
                const attachment = message.attachment;
                try {
                    let filePath = null;
                    if (attachment) {
                        const s3Connection = await s3ConnectionLoader();
                        const base64Data = Buffer.from(attachment.replace(/^data:\w+\/\w+;base64,/, ''), 'base64');
                        const type = attachment.split(';')[0].split('/')[1];
                        const mimeType = attachment.split(';')[0].split(':')[1];
                        const params = {
                            Bucket: AWS_S3.docBucket,
                            Key: `attachment_${Date.now()}` + '.' + mimeType.split('/')[1], // type is not required
                            Body: base64Data,
                            ContentEncoding: 'base64', // required
                            ContentType: mimeType, // required. Notice the back ticks,
                        };
                        const {Location, Key} = await s3Connection.upload(params).promise();
                        filePath = Key;
                    }
                    const chatMessage = propertyChatDataMapping({
                        propertyRequestId: propertyRequestId,
                        senderId: senderChatID,
                        content: content,
                        attachmentPath: filePath ?? null,
                    });
                    const savedMessage = await saveMessage(socket.handshake.query.userSession, chatMessage);
                    if (savedMessage.attachmentPath) {
                        savedMessage.attachmentPath = await getFileURL(savedMessage.attachmentPath, AWS_S3.docBucket);
                    }
                    socket.in(socket.handshake.query.room).emit('receive_message', savedMessage);
                } catch (error) {
                    Log.error(TAG, 'sendMessage()', error);
                    socket.in(socket.handshake.query.room).emit('error', 'Failed to send message!');
                }
            });

            socket.on('fetch_messages', async (message) => {
                const propertyRequestId = message.propertyRequestId;
                try {
                    const messages = await getPropertyMessages(propertyRequestId);
                    for (const msg of messages) {
                        if (msg.attachmentPath) {
                            msg.attachmentPath = await getFileURL(msg.attachmentPath, AWS_S3.docBucket);
                        }
                    }
                    socket.emit('show_messages', messages);
                } catch (error) {
                    Log.error(TAG, 'fethMessages()', error);
                    socket.emit('error', new Error('Failed to fetch messages!'));
                }
            });
        });

    } catch (error) {
        Log.error(TAG, 'initialiseSocket()', error);
        throw error;
    }
}
