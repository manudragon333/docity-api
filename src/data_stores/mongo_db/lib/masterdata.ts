import {BaseRecord, IBaseRecord, IRegionListApiRequest, Log} from 'models';
import Region from '../db_models/region';
import PropertyType from '../db_models/property_type';
import Assessment_question from '../db_models/assessment_questions';
import {findAllRecords, findOne} from 'data_stores/mongo_db/helpers/query';
import DocumentType from 'data_stores/mongo_db/db_models/document_type';
import QueryType from 'data_stores/mongo_db/db_models/query_types';
import {AssessmentQuestion, IAssessmentQuestion} from 'src/models/lib/assessment_question';

const TAG = 'data_stores.mongo_db.lib.masterdata';

export async function getRegions(queryParam: IRegionListApiRequest): Promise<IBaseRecord[]> {

    try {
        Log.info(TAG, 'Get all regions');
        const conditions: any = {
            $and: [{status: 1}]
        };
        if (queryParam.regionType) {
            conditions.$and.push({
                region_type: queryParam.regionType,
            });
        }
        const regions = await findAllRecords(Region, conditions, {
            _id: 1,
            region_name: 1,
            region_code: 1
        }, {}, []);
        const regionsList: IBaseRecord [] = [];
        for (const region of regions) {
            regionsList.push(
                new BaseRecord(region?._id, region?.region_name, region?.region_code)
            );
        }
        return regionsList;
    } catch (err) {
        Log.error(TAG, 'getRegions()', err);
        throw err;
    }
}

export async function getAllPropertyTypes(regionTypeRequired: number = 0): Promise<IBaseRecord[]> {

    try {
        Log.info(TAG, 'Get all property types');
        const projections: any = {
            _id: 1,
            pt_name: 1,
            pt_code: 1,
        };
        if (regionTypeRequired) {
            projections.region_type = regionTypeRequired;
        }
        const propertyTypes = await findAllRecords(PropertyType, {status: 1}, projections, {}, []);
        const propertyTypeList: IBaseRecord[] = [];
        for (const propertyType of propertyTypes) {
            const data = new BaseRecord(propertyType?._id, propertyType?.pt_name, propertyType?.pt_code, {
                regionType: propertyType.region_type
            });
            propertyTypeList.push(data);
        }
        return propertyTypeList;
    } catch (err) {
        Log.error(TAG, 'getAllPropertyTypes()', err);
        throw err;
    }

}

export async function getQueryTypes(): Promise<BaseRecord[]> {

    Log.info(TAG, 'Get all query types');
    try {
        const queryTypes = await findAllRecords(QueryType, {}, {
            _id: 1,
            query_type: 1,
        }, {}, []);
        const queryTypesList: BaseRecord[] = [];
        for (const queryType of queryTypes) {
            queryTypesList.push(new BaseRecord(queryType?._id, queryType?.query_type,));
        }
        return queryTypesList;
    } catch (err) {
        Log.error(TAG, 'getQueryTypes()', err);
        throw err;
    }
}

export async function getDocumentTypes(): Promise<BaseRecord[]> {

    Log.info(TAG, 'Get all document types');
    try {
        const uploadTypes = await findAllRecords(DocumentType, {}, {
            _id: 1,
            document_type: 1,
            document_type_code: 1
        }, {}, []);
        const uploadTypeList: BaseRecord[] = [];
        for (const uploadType of uploadTypes) {
            uploadTypeList.push(new BaseRecord(uploadType?._id, uploadType?.document_type,
                uploadType?.document_type_code));
        }
        return uploadTypeList;
    } catch (err) {
        Log.error(TAG, 'getDocumentTypes()', err);
        throw err;
    }
}

export async function getAssessmentQuestions(): Promise<BaseRecord[]> {

    Log.info(TAG, 'Getting assessment questions');
    try {
        const assessmentQuestions = await findAllRecords(Assessment_question, {}, {
            _id: 1,
            assessment_question: 1,
            question_type: 1,
            options: 1
        }, {}, []);
        const assessmentQuestionsList: AssessmentQuestion[] = [];
        for (const assessmentQuestion of assessmentQuestions) {
            if (assessmentQuestion.options === null) {
                assessmentQuestionsList.push(new AssessmentQuestion(assessmentQuestion?._id,
                    assessmentQuestion?.assessment_question, [],
                    assessmentQuestion?.question_type));
            } else {
                assessmentQuestionsList.push(new AssessmentQuestion(assessmentQuestion?._id,
                    assessmentQuestion?.assessment_question, assessmentQuestion.options?.split(','),
                    assessmentQuestion?.question_type));
            }

        }
        return assessmentQuestionsList;
    } catch (err) {
        Log.error(TAG, 'Error while fetching assessment questions', err);
        throw err;
    }
}

export async function getPropertyTypeById(id: string): Promise<BaseRecord> {

    try {
        Log.info(TAG, 'Get property type.');
        const propertyType = await findOne(PropertyType, {
            _id: id,
            status: 1
        }, {
            _id: 1,
            pt_name: 1,
            pt_code: 1
        }, {}, []);
        return propertyType ? new BaseRecord(propertyType?._id, propertyType?.pt_name, propertyType?.pt_code)
            : propertyType;
    } catch (err) {
        Log.error(TAG, 'getPropertyTypeById()', err);
        throw err;
    }

}

export async function getRegionById(id: string): Promise<IBaseRecord> {

    try {
        Log.info(TAG, 'Get region!!');
        const region = await findOne(Region, {
            _id: id,
            status: 1,
        }, {
            _id: 1,
            region_name: 1,
            region_code: 1
        }, {}, []);
        return region ? new BaseRecord(region?._id, region?.region_name, region?.region_code) : region;
    } catch (err) {
        Log.error(TAG, 'getRegionById()', err);
        throw err;
    }
}

export async function getDocumentTypeById(id: string): Promise<BaseRecord> {

    Log.info(TAG, 'Get all document type');
    try {
        const uploadType = await findOne(DocumentType, {
            _id: id,
        }, {
            _id: 1,
            document_type: 1,
            document_type_code: 1
        }, {}, []);
        return uploadType ? new BaseRecord(uploadType?._id, uploadType?.document_type,
            uploadType?.document_type_code) : uploadType;
    } catch (err) {
        Log.error(TAG, 'getDocumentTypeById()', err);
        throw err;
    }
}