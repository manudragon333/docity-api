import {IRegionListApiRequest, IServiceResponse, ListAPIResponse, Log, ServiceResponse} from 'models';
import {MasterData} from 'data_stores/mongo_db';
import {HttpStatusCodes} from 'constants/status_codes';
import {fetchPropertyTypeById} from 'data_stores/mongo_db/cache/property_type';

const TAG = 'service.masterdata';

export async function getAllRegions(queryParam: IRegionListApiRequest): Promise<IServiceResponse> {

    Log.info(TAG, +'Get regions');
    const serviceResponse: IServiceResponse = new ServiceResponse(HttpStatusCodes.OK,
        'Regions fetched successfully', false);
    try {
        const propertyRequest = await fetchPropertyTypeById(queryParam.propertyTypeId);
        if (propertyRequest || !queryParam.propertyTypeId) {
            queryParam.regionType = propertyRequest?.additionalProp1?.regionType;
            const result = await MasterData.getRegions(queryParam);
            serviceResponse.data = new ListAPIResponse(result);
        } else {
            serviceResponse.data = new ListAPIResponse([]);
        }
    } catch (err) {
        Log.error(TAG, 'Error while getting region types', err);
        serviceResponse.addServerError('Failed to fetch the regions due to technical difficulties!');
    }
    return serviceResponse;
}

export async function getAllPropertyTypes(): Promise<IServiceResponse> {
    Log.info(TAG, +'Get regions');
    const serviceResponse: IServiceResponse = new ServiceResponse(HttpStatusCodes.OK,
        'Regions fetched successfully', false);
    try {
        const result = await MasterData.getAllPropertyTypes();
        serviceResponse.data = new ListAPIResponse(result);
    } catch (err) {
        Log.error(TAG, 'Erroe while getting property types', err);
        serviceResponse.addServerError('Failed to fetch the property types due to technical difficulties!');
    }
    return serviceResponse;
}
export async function getQueryTypes(): Promise<IServiceResponse> {

    Log.info(TAG, 'Get upload type');
    const serviceResponse: IServiceResponse = new ServiceResponse(HttpStatusCodes.OK, 'upload types fetched successfully', false);
    try {
        const result = await MasterData.getQueryTypes();
        serviceResponse.data = new ListAPIResponse(result);
    } catch (err) {
        Log.error(TAG, 'error while getting upload types', err);
        serviceResponse.addServerError('Failed to fetch the document types due to technical difficulties!');
    }
    return serviceResponse;
}

export async function getDocumentTypes(): Promise<IServiceResponse> {

    Log.info(TAG, 'Get upload type');
    const serviceResponse: IServiceResponse = new ServiceResponse(HttpStatusCodes.OK, 'upload types fetched successfully', false);
    try {
        const result = await MasterData.getDocumentTypes();
        serviceResponse.data = new ListAPIResponse(result);
    } catch (err) {
        Log.error(TAG, 'error while getting upload types', err);
        serviceResponse.addServerError('Failed to fetch the document types due to technical difficulties!');
    }
    return serviceResponse;
}
