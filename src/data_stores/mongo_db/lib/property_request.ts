import {IPropertyRequest} from 'src/models/lib/property_request';
import PropertyRequest from '../db_models/property_request';
import {propertyRequestDataMapping} from 'data_stores/mongo_db/helpers/data_mapping/property_request';
import {IPropertyChat, IPropertyDoc, IPropertyRequestListApiRequest, IUserSession, Log} from 'models';
import {
    countRecords,
    findAllRecords,
    findOne,
    findOneAndDelete,
    findOneAndUpdate
} from 'data_stores/mongo_db/helpers/query';
import PropertyDocument from '../db_models/property_document';
import {propertyDocDataMapping} from 'data_stores/mongo_db/helpers/data_mapping/property_doc';
import {ROLE_LIST, STATUS_LIST} from 'constants/master_data';
import {IDocComment} from 'src/models/lib/doc_comment';
import {docCommentDataMapping} from 'data_stores/mongo_db/helpers/data_mapping/doc_comment';
import PropertyMessage from '../db_models/property_chat';
import {propertyChatDataMapping} from 'data_stores/mongo_db/helpers/data_mapping/property_chat';

const TAG = 'data_stores.mongo_db.lib.property_request';

const populatePaths = [{
    path: 'requested_user',
    select: {
        _id: 1,
        f_nm: 1,
        l_name: 1,
        email: 1,
        ph_no: 1,
    }
}, {
    path: 'civil_engineer',
    select: {
        _id: 1,
        f_nm: 1,
        l_name: 1,
        email: 1,
        ph_no: 1,
    }
}];

export async function saveVerifyProperty(doc: IPropertyRequest, loggedInUser: IUserSession) {
    try {
        const propertyRequest = new PropertyRequest({
            reference_id: doc.referenceId,
            property_type_id: doc.propertyType.id ?? null,
            property_type: doc.propertyType?.name ?? null,
            region_id: doc.region?.id ?? null,
            region_name: doc.region?.name ?? null,
            name: doc.name ?? null,
            email_id: doc.emailId ?? null,
            contact_number: doc.contactNumber ?? null,
            requested_user: loggedInUser.userId ?? null,
            address: doc.address ?? null,
            city: doc.city ?? null,
            state: doc.state ?? null,
            pincode: doc.pincode ?? null,
            latitude: doc.latitude ?? null,
            longitude: doc.longitude ?? null,
            c_dt: new Date(),
            m_dt: new Date(),
            c_by: loggedInUser?.userId ?? null,
            m_by: loggedInUser?.userId ?? null,
            // TODO change to 0 after payment integration
            status: STATUS_LIST['2'].id,
        });
        const result = (await propertyRequest.save()).populate(populatePaths);
        return propertyRequestDataMapping(result, loggedInUser);
    } catch (error) {
        Log.error(TAG, 'saveVerifyProperty()', error);
        throw error;
    }
}

export async function updateVerifyPropertyRequest(doc: IPropertyRequest, loggedInUser: IUserSession) {

    Log.info(TAG, 'Update property verify request');
    try {
        const result = await findOneAndUpdate(PropertyRequest, {_id: doc.id}, {
            $set: {
                property_type_id: doc.propertyType.id ?? null,
                property_type: doc.propertyType?.name ?? null,
                region_id: doc.region?.id ?? null,
                region_name: doc.region?.name ?? null,
                name: doc.name ?? null,
                address: doc.address ?? null,
                city: doc.city ?? null,
                state: doc.state ?? null,
                pincode: doc.pincode ?? null,
                latitude: doc.latitude ?? null,
                longitude: doc.longitude ?? null,
                m_dt: new Date(),
                m_by: loggedInUser?.userId ?? null,
            }
        }, {});
        return propertyRequestDataMapping(result, loggedInUser);
    } catch (err) {
        Log.error(TAG, 'updateVerifyProperty()', err);
        throw err;
    }
}

export async function getAllPropertyRequests(loggedInUser: IUserSession,
                                             queryParams: IPropertyRequestListApiRequest) {

    Log.info(TAG, 'Get All requests');
    try {
        const conditions: any = {};
        if (loggedInUser.role.filter((role) => role.name === ROLE_LIST.USER.name)[0]) {
            conditions.requested_user = loggedInUser.userId;
        } else if (loggedInUser.role.filter((role) => role.name === ROLE_LIST.CIVIL_ENGINEER.name)[0]) {
            conditions.civil_engineer = loggedInUser.userId;
        }
        if (queryParams.searchText) {
            conditions.$text = {
                $search: queryParams.searchText
            };
        }
        if (queryParams?.status?.length) {
            conditions.status = {
                $in: queryParams?.status,
            };
        } else {
            conditions.status = {
                $ne: STATUS_LIST['0'].id,
            };
        }
        if (queryParams?.region?.length) {
            conditions.region_id = {
                $in: queryParams?.region,
            };
        }
        if (queryParams?.location?.length) {
            conditions.city = {
                $in: queryParams?.location,
            };
        }
        if (queryParams?.propertyType?.length) {
            conditions.property_type_id = {
                $in: queryParams?.propertyType,
            };
        }
        const options: any = {};
        if (queryParams.sortBy) {
            options.sort = {};
            options.sort[queryParams.sortBy] = queryParams.sortOrder.toLowerCase() == 'asc' ? 1 : -1;
        } else {
            options.sort = {};
            options.sort.c_dt = 'desc';
        }
        if (queryParams.offset) {
            options.skip = queryParams.offset;
        }
        if (queryParams.limit) {
            options.limit = queryParams.limit;
        }
        const result = await findAllRecords(PropertyRequest, conditions, {
            _id: 1,
            reference_id: 1,
            property_type_id: 1,
            property_type: 1,
            region_id: 1,
            region_name: 1,
            name: 1,
            email_id: 1,
            contact_number: 1,
            requested_user: 1,
            address: 1,
            city: 1,
            state: 1,
            pincode: 1,
            latitude: 1,
            longitude: 1,
            status: 1,
            estimated_finish_date: 1,
            payment_status: 1,
            c_dt: 1,
            m_dt: 1,
        }, options, populatePaths);
        const propertyRequests: IPropertyRequest[] = [];
        for (const request of result) {
            propertyRequests.push(propertyRequestDataMapping(request));
        }
        return propertyRequests;
    } catch (err) {
        Log.error(TAG, 'getAllPropertyRequests()', err);
        throw err;
    }
}

export async function getAllPropertyRequestsCount(loggedInUser: IUserSession,
                                                  queryParams: IPropertyRequestListApiRequest) {

    Log.info(TAG, 'Get All requests count');
    try {
        const conditions: any = {};
        if (loggedInUser.role.filter((role) => role.name === ROLE_LIST.USER.name)[0]) {
            conditions.requested_user = loggedInUser.userId;
        } else if (loggedInUser.role.filter((role) => role.name === ROLE_LIST.CIVIL_ENGINEER.name)[0]) {
            conditions.civil_engineer = loggedInUser.userId;
        }
        if (queryParams.searchText) {
            conditions.$text = {
                $search: queryParams.searchText
            };
        }
        if (queryParams?.status?.length) {
            conditions.status = {
                $in: queryParams?.status,
            };
        } else {
            conditions.status = {
                $ne: STATUS_LIST['0'].id,
            };
        }
        if (queryParams?.region?.length) {
            conditions.region_id = {
                $in: queryParams?.region,
            };
        }
        if (queryParams?.location?.length) {
            conditions.city = {
                $in: queryParams?.location,
            };
        }
        if (queryParams?.propertyType?.length) {
            conditions.property_type_id = {
                $in: queryParams?.propertyType,
            };
        }
        const result = await countRecords(PropertyRequest, conditions, {});
        return result;
    } catch (err) {
        Log.error(TAG, 'getAllPropertyRequestsCount()', err);
        throw err;
    }
}

export async function getPropertyRequestById(id: string) {

    Log.info(TAG, 'Get request details');
    try {
        const result = await findOne(PropertyRequest, {
            _id: id,
        }, {
            _id: 1,
            reference_id: 1,
            property_type_id: 1,
            property_type: 1,
            region_id: 1,
            region_name: 1,
            name: 1,
            email_id: 1,
            contact_number: 1,
            requested_user: 1,
            address: 1,
            city: 1,
            state: 1,
            pincode: 1,
            latitude: 1,
            longitude: 1,
            document_writer: 1,
            status: 1,
            civil_engineer: 1,
            civil_engineer_response: 1,
            payment_status: 1,
            estimated_finish_date: 1,
            final_report: 1,
            c_dt: new Date(),
            m_dt: new Date(),
        }, {}, populatePaths);
        return propertyRequestDataMapping(result);
    } catch (err) {
        Log.error(TAG, 'getAllPropertyRequests()', err);
        throw err;
    }
}

export async function checkDuplicateReferenceId(referenceId: string) {
    try {
        const result = await findOne(PropertyRequest, {
            reference_id: referenceId,
        }, {
            _id: 1,
        });
        return !!result;
    } catch (error) {
        Log.error(TAG, 'checkDuplicateReferenceId()', error);
        throw error;
    }
}

export async function savePropertyDocument(loggedInUser: IUserSession, doc: IPropertyDoc) {
    try {
        const propertyDoc = new PropertyDocument({
            property_id: doc.propertyRequestId,
            attachment_type_id: doc.attachmentType?.id ?? null,
            attachment_type: doc.attachmentType?.name ?? null,
            mime_type: doc.mimeType,
            path: doc.path,
            name: doc.name,
            notes: doc?.notes ?? null
        });
        const result = await propertyDoc.save();
        return propertyDocDataMapping(result);
    } catch (error) {
        Log.error(TAG, 'savePropertyDocument()', error);
        throw error;
    }
}

export async function deletePropertyDocument(id: string) {
    try {
        return await findOneAndDelete(PropertyDocument, {
            _id: id,
        }, {
            projection: {
                path: 1,
            }
        });
    } catch (error) {
        Log.error(TAG, 'deletePropertyDocument()', error);
        throw error;
    }
}

export async function checkPropertyRequestExist(id: string) {
    try {
        const result = await findOne(PropertyRequest, {
            _id: id,
        }, {
            _id: 1,
        }, {});
        return !!result;
    } catch (error) {
        Log.error(TAG, 'checkPropertyRequestExist()', error);
        throw error;
    }
}

export async function getPropertyDocuments(propertyRequestId: string): Promise<IPropertyDoc[]> {
    try {
        const result = await findAllRecords(PropertyDocument, {
            property_id: propertyRequestId,
        }, {
            _id: 1,
            property_id: 1,
            attachment_type_id: 1,
            attachment_type: 1,
            mime_type: 1,
            path: 1,
            name: 1,
            notes: 1,
        });
        const propertyDocs: IPropertyDoc[] = [];
        for (const doc of result) {
            doc.comments = await fetchPropertyDocComments(doc._id);
            propertyDocs.push(propertyDocDataMapping(doc));
        }
        return propertyDocs;
    } catch (error) {
        Log.error(TAG, 'propertyDocuments()', error);
        throw error;
    }
}

export async function getPropertyDocument(id: string): Promise<IPropertyDoc> {
    try {
        const result = await findOne(PropertyDocument, {
            _id: id,
        }, {
            property_id: 1,
            attachment_type_id: 1,
            attachment_type: 1,
            mime_type: 1,
            path: 1,
            name: 1,
            notes: 1,
        });
        return propertyDocDataMapping(result);
    } catch (error) {
        Log.error(TAG, 'getPropertyDocument()', error);
        throw error;
    }
}

export async function updatePropertyDocument(id: string, notes: string) {
    try {
        const result = await findOneAndUpdate(PropertyDocument, {
            _id: id,
        }, {
            notes: notes
        }, {
            new: true,
        });
        return propertyDocDataMapping(result);
    } catch (error) {
        Log.error(TAG, 'updatePropertyDocument()', error);
        throw error;
    }
}

export async function updatePropertyDocumentWriter(id: string, documentWriter: any) {
    try {
        return await findOneAndUpdate(PropertyRequest, {
            _id: id,
        }, {
            document_writer: {
                name: documentWriter.name,
                contact_number: documentWriter.contactNumber,
            }
        }, {
            new: true,
        });
    } catch (error) {
        Log.error(TAG, 'documentWriter()', error);
        throw error;
    }
}

export async function assignPropertyRequestToCivilEngineer(id: string, civilEngineer: string) {
    try {
        const result = await findOneAndUpdate(PropertyRequest, {
            _id: id,
        }, {
            civil_engineer: civilEngineer,
            status: STATUS_LIST['3'].id,
            civil_engineer_response: STATUS_LIST['4'].id,
        }, {});
        return propertyDocDataMapping(result);
    } catch (error) {
        Log.error(TAG, 'assignPropertyRequestToCivilEngineer()', error);
        throw error;
    }
}

export async function updatePropertyRequestCivilEngineerResponse(id: string,
                                                                 loggedInUser: IUserSession,
                                                                 civilEngineerResponse: number,
                                                                 estimatedFinishDate: string,
                                                                 status: number) {
    try {
        const result = await findOneAndUpdate(PropertyRequest, {
            _id: id,
            civil_engineer: loggedInUser?.userId,
        }, {
            $set: {
                m_by: loggedInUser?.userId,
                m_dt: new Date(),
                civil_engineer_response: civilEngineerResponse,
                estimated_finish_date: estimatedFinishDate,
                status: status,
            }
        }, {});
        return propertyDocDataMapping(result);
    } catch (error) {
        Log.error(TAG, 'updaePropertyRequestCivilEngineerResponse()', error);
        throw error;
    }
}

export async function updatePropertyRequestStatus(id: string, status: number) {
    try {
        return await findOneAndUpdate(PropertyRequest, {
            _id: id,
        }, {
            status: status,
        }, {});
    } catch (error) {
        Log.error(TAG, 'updatePropertyRequestStatus()', error);
        throw error;
    }
}

export async function updatePropertyRequestPaymentStatusAndStatus(id: string, paymentStatus: number,
                                                                  status: number) {
    try {
        const result = await findOneAndUpdate(PropertyRequest, {
            _id: id,
        }, {
            payment_status: paymentStatus,
            status: status,
            m_dt: new Date(),
        }, {});
        return propertyDocDataMapping(result);
    } catch (error) {
        Log.error(TAG, 'updatePropertyRequestPaymentStatusAndStatus()', error);
        throw error;
    }
}

export async function savePropertyDocComment(loggedInUser: IUserSession, id: string, comment: IDocComment) {
    try {
        return await findOneAndUpdate(PropertyDocument, {
            _id: id,
        }, {
            $addToSet: {
                comments: {
                    note: comment?.note ?? null,
                    added_by: loggedInUser?.userId ?? null,
                    type: comment?.type ?? null,
                    pos_x: comment?.positionX ?? null,
                    pos_y: comment?.positionY ?? null,
                    width: comment?.width ?? null,
                    height: comment?.height ?? null,
                    page_nb: comment?.pageNumber ?? null,
                    created_by: loggedInUser?.userId ?? null,
                    created_at: new Date(),
                    last_updated_by: loggedInUser?.userId ?? null,
                    last_updated_at: new Date(),
                }
            }
        }, {});
    } catch (error) {
        Log.error(TAG, 'savePropertyDocComment()', error);
        throw error;
    }
}

export async function fetchPropertyDocComments(id: string) {
    try {
        const result = await findOne(PropertyDocument, {
            _id: id,
        }, {
            comments: 1,
        }, {}, [{
            path: 'comments.created_by',
            select: {
                _id: 1,
                f_nm: 1,
                l_name: 1,
            }
        }, {
            path: 'comments.last_updated_by',
            select: {
                _id: 1,
                f_nm: 1,
                l_nm: 1,
            }
        }]);
        const docComments: IDocComment[] = [];
        for (const comment of result?.comments ?? []) {
            docComments.push(docCommentDataMapping(comment));
        }
        return docComments;
    } catch (error) {
        Log.error(TAG, 'savePropertyComments()', error);
        throw error;
    }
}

export async function updatePropertyDocComment(loggedInUser: IUserSession, docId: string, commentId: string,
                                               comment: IDocComment) {
    try {
        return await findOneAndUpdate(PropertyDocument, {
            '_id': docId,
            'comments._id': commentId,
        }, {
            $set: {
                'comments.$.note': comment?.note ?? null,
                'comments.$.added_by': loggedInUser?.userId ?? null,
                'comments.$.type': comment?.type ?? null,
                'comments.$.pos_x': comment?.positionX ?? null,
                'comments.$.pos_y': comment?.positionY ?? null,
                'comments.$.width': comment?.width ?? null,
                'comments.$.height': comment?.height ?? null,
                'comments.$.page_nb': comment?.pageNumber ?? null,
                'comments.$.last_updated_by': loggedInUser?.userId ?? null,
                'comments.$.last_updated_at': new Date(),
            }
        });
    } catch (error) {
        Log.error(TAG, 'savePropertyComments()', error);
        throw error;
    }
}

export async function deletePropertyComments(docId: string, commentId: string) {
    try {
        return await findOneAndUpdate(PropertyDocument, {
            _id: docId,
        }, {
            $pull: {
                comments: {
                    _id: commentId,
                },
            }
        });
    } catch (error) {
        Log.error(TAG, 'savePropertyComments()', error);
        throw error;
    }
}

export async function updateFinalReport(loggedInUser: IUserSession, propertyRequestId: string, path: string,
                                        note: string, status: number) {
    try {
        return await findOneAndUpdate(PropertyRequest, {
            _id: propertyRequestId,
        }, {
            $set: {
                final_report: {
                    path: path,
                    note: note,
                    created_at: new Date(),
                    last_updated_at: new Date(),
                    created_by: loggedInUser?.userId ?? null,
                    last_updated_by: loggedInUser?.userId ?? null,
                },
                status: status,
            }
        });
    } catch (error) {
        Log.error(TAG, 'savePropertyComments()', error);
        throw error;
    }
}

export async function checkValidUserOfPropertyRequest(propertyRequestId: string, userId: string) {
    try {
        const result = await findOne(PropertyRequest, {
            _id: propertyRequestId,
            $or: [
                {civil_engineer: userId},
                {requested_user: userId},
            ]
        }, {
            _id: 1,
        });
        return !!result;
    } catch (error) {
        Log.error(TAG, 'checkValidUserOfPropertyRequest()', error);
        throw error;
    }
}

export async function saveMessage(loggedInUser: IUserSession, payload: IPropertyChat) {
    try {
        const message = new PropertyMessage({
            property_request_id: payload?.propertyRequestId,
            sender: payload?.senderId,
            content: payload?.content,
            attachment_path: payload?.attachmentPath,
            created_at: new Date(),
            last_updated_at: new Date(),
        });
        await message.save();
        const result = await PropertyMessage.populate(message, [{
            path: 'sender',
            select: {
                _id: 1,
                f_nm: 1,
                l_nm: 1,
                pic: 1,
            }
        }]);
        return propertyChatDataMapping(result);
    } catch (error) {
        Log.error(TAG, 'saveMessage()', error);
        throw error;
    }
}

export async function getPropertyMessages(propertyRequestId: string) {
    try {
        const result = await findAllRecords(PropertyMessage, {
            property_request_id: propertyRequestId,
        }, {
            property_request_id: 1,
            sender: 1,
            content: 1,
            attachment_path: 1,
            created_at: 1,
            last_updated_at: 1,
        }, {
            sort: {
                created_at: 1
            }
        }, [{
            path: 'sender',
            select: {
                _id: 1,
                f_nm: 1,
                l_nm: 1,
                pic: 1,
            }
        }]);
        const messages: IPropertyChat[] = [];
        for (const message of result) {
            messages.push(propertyChatDataMapping(message));
        }
        return messages;
    } catch (error) {
        Log.error(TAG, 'getPropertyMessages()', error);
        throw error;
    }
}

export async function getAllPropertyRequestLocations(loggedInUser: IUserSession, search: string) {
    try {
        const conditions: any = {};
        if (loggedInUser.role.filter((role) => role.name === ROLE_LIST.USER.name)[0]) {
            conditions.requested_user = loggedInUser.userId;
        } else if (loggedInUser.role.filter((role) => role.name === ROLE_LIST.CIVIL_ENGINEER.name)[0]) {
            conditions.civil_engineer = loggedInUser.userId;
        }
        if (search) {
            conditions.$text = {
                $search: search
            };
        }
        const result = await findAllRecords(PropertyRequest, conditions, {
            city: 1,
        });
        return result;
    } catch (error) {
        Log.error(TAG, 'getAllPeropertyRequestLocations()', error);
    }
}