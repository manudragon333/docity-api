import { Log } from "models";
import * as nodeUtil from "util";

const TAG = "dat_stores.mongodb.helpers.query";

export async function findOne(
  model: any,
  conditions: any,
  projections: any,
  options?: any,
  populatePaths: any[] = []
) {
  Log.info(TAG + ".findOne()");
  try {
    Log.debug("Conditions: ", nodeUtil.inspect(conditions));

    return await model
      .findOne(conditions, projections, options)
      .populate(populatePaths)
      .lean()
      .exec();
  } catch (error) {
    Log.error(TAG, "findOne()", error);
    throw error;
  }
}

export async function findAllRecords(
  model: any,
  conditions: any,
  projections: any,
  options?: any,
  populatePaths: any[] = []
) {
  Log.info(TAG + ".find()");
  try {
    Log.debug("Conditions", nodeUtil.inspect(conditions));

    return await model
      .find(conditions, projections, options)
      .populate(populatePaths)
      .lean()
      .exec();
  } catch (error) {
    Log.error(TAG, "find()", error);
    throw error;
  }
}

export async function findOneAndUpdate(
  model: any,
  conditions: any,
  update: any,
  options?: any,
  populatePaths: any[] = []
) {
  Log.info(TAG + ".findOneAndUpdate()");
  try {
    Log.debug("Conditions", nodeUtil.inspect(conditions));
    Log.debug("Updates", nodeUtil.inspect(update));

    return await model
      .findOneAndUpdate(conditions, update, options)
      .populate(populatePaths)
      .lean()
      .exec();
  } catch (error) {
    Log.error(TAG, "findOneAndUpdate()", error);
    throw error;
  }
}

export async function findOneAndDelete(
  model: any,
  conditions: any,
  options?: any,
  populatePaths: any[] = []
) {
  Log.info(TAG + ".findOneAndDelete()");
  try {
    Log.debug("Conditions", nodeUtil.inspect(conditions));

    return await model
      .findOneAndDelete(conditions, options)
      .populate(populatePaths)
      .lean()
      .exec();
  } catch (error) {
    Log.error(TAG, "findOneAndDelete()", error);
    throw error;
  }
}

export async function findCount(model: any, conditions: any) {
  Log.info(TAG + ".findCount()");
  try {
    Log.debug("Conditions", nodeUtil.inspect(conditions));

    return await model.count(conditions).lean().exec();
  } catch (error) {
    Log.error(TAG, "findCount()", error);
    throw error;
  }
}

export async function countRecords(model: any, conditions: any, options?: any) {
  Log.info(TAG + ".countRecords()");
  try {
    Log.debug("Conditions", nodeUtil.inspect(conditions));

    return await model.count(conditions);
  } catch (error) {
    Log.error(TAG, "countRecords()", error);
    throw error;
  }
}
