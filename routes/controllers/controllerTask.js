const express = require('express');
const router = express.Router();
const Joi = require('joi');
const globalFunction = require('../../utils/globalFunction');
const serviceTask = require('../services/serviceTask');
const CONSTANTS = require('../../utils/constants');
const CONSTANTS_MSG = require('../../utils/constantsMessage');
const apiSuccessRes = globalFunction.apiSuccessRes;
const apiErrorRes = globalFunction.apiErrorRes;


async function createTask(req, res) {

  const registerParamSchema = Joi.object({
    name: Joi.string().required(),
    type: Joi.number().required(),
    Desc1: Joi.string().required(),
    Desc2: Joi.string().required(),
    colorCode: Joi.string().required(),
    icon: Joi.string().required(),
  });
  try {
    await registerParamSchema.validate(req.body, {
      abortEarly: true
    });
  } catch (error) {
    return apiErrorRes(req, res, error.details[0].message);
  }
  // console.log('req.body: ',req.body)
  let modelData = await serviceTask.getTaskByName(req.body.name);
  // console.log("modelData:",modelData)
  if (modelData.statusCode === CONSTANTS.SUCCESS) {
    return apiErrorRes(req, res, "Task already available!");
  } else if (modelData.data == null) {
    let modeldataRes = await serviceTask.saveTask(req.body);
    if (modeldataRes.statusCode == CONSTANTS.SUCCESS) {
      return apiSuccessRes(req, res, CONSTANTS_MSG.SUCCESS, modeldataRes.data);
    } else if (modeldataRes.statusCode == 11000) {
      return apiErrorRes(req, res, "Task already available!");
    } else {
      return apiErrorRes(req, res, CONSTANTS_MSG.FAILURE);
    }
  } else {
    return apiErrorRes(req, res, CONSTANTS_MSG.FAILURE);
  }
}
async function getTaskList(req, res) {

  const registerParamSchema = Joi.object({
    keyWord: Joi.string().empty(""),
    pageNo: Joi.number().integer().min(1),
    size: Joi.number().integer().min(1),
  });

  try {
    await registerParamSchema.validate(req.body, {
      abortEarly: true
    });
  } catch (error) {
    console.log(error);
    return apiErrorRes(req, res, error.details[0].message);
  }
  let resData = await serviceTask.getTaskList(req.body);

  if (resData.statusCode === CONSTANTS.SUCCESS) {

    return apiSuccessRes(req, res, 'Success', resData.data);
  } else {
    return apiErrorRes(req, res, 'Restaurent not found.', []);
  }
}
async function getAllTask(req, res) {
  let resData = await serviceTask.getAllTask();
  if (resData.statusCode === CONSTANTS.SUCCESS) {
    return apiSuccessRes(req, res, 'Success', resData.data);
  } else {
    return apiErrorRes(req, res, 'Restaurent not found.', []);
  }
}
async function updateTask(req, res) {

  const registerParamSchema = Joi.object({
    id: Joi.string().required(),
    name: Joi.string().required(),
    type: Joi.number().required(),
    Desc1: Joi.string().required(),
    Desc2: Joi.string().required(),
    colorCode: Joi.string().required(),
    icon: Joi.string().required(),
  });

  try {
    await registerParamSchema.validate(req.body, {
      abortEarly: true
    });
  } catch (error) {
    return apiErrorRes(req, res, error.details[0].message);
  }
  let modelData = await serviceTask.getTaskById(req.body.id);
  
  if (modelData.statusCode === CONSTANTS.SUCCESS) {
    modelData.data.name = req.body.name;
    modelData.data.type = req.body.type;
    modelData.data.Desc1 = req.body.Desc1;
    modelData.data.Desc2 = req.body.Desc2;
    modelData.data.colorCode = req.body.colorCode;
    modelData.data.icon = req.body.icon;
    await modelData.data.save();
    return apiSuccessRes(req, res, CONSTANTS_MSG.UPDATE_SUCCESS, modelData.data);
  } else if (modelData.statusCode === CONSTANTS.NOT_FOUND) {
    return apiErrorRes(req, res, CONSTANTS_MSG.NOT_FOUND);
  } else {
    return apiErrorRes(req, res, CONSTANTS_MSG.FAILURE);
  }
}
async function deleteTask(req, res) {

  const registerParamSchema = Joi.object({
    id: Joi.string().required(),
  });

  try {
    await registerParamSchema.validate(req.body, {
      abortEarly: true
    });
  } catch (error) {
    return apiErrorRes(req, res, error.details[0].message);
  }
  let modelData = await serviceTask.getTaskById(req.body.id);
  if (modelData.statusCode === CONSTANTS.SUCCESS) {
    await modelData.data.remove();
    return apiSuccessRes(req, res, CONSTANTS_MSG.DELETE_SUCCESS);
  } else if (modelData.statusCode === CONSTANTS.NOT_FOUND) {
    return apiErrorRes(req, res, CONSTANTS_MSG.NOT_FOUND);
  } else {
    return apiErrorRes(req, res, CONSTANTS_MSG.FAILURE);
  }
}
async function updateTaskStatus(req, res) {

  const registerParamSchema = Joi.object({
    id: Joi.string().required(),
  });

  try {
    await registerParamSchema.validate(req.body, {
      abortEarly: true
    });
  } catch (error) {
    return apiErrorRes(req, res, error.details[0].message);
  }
  let modelData = await serviceTask.getTaskById(req.body.id);
  if (modelData.statusCode === CONSTANTS.SUCCESS) {
    modelData.data.isActive = !modelData.data.isActive;
    await modelData.data.save();
    return apiSuccessRes(req, res, CONSTANTS_MSG.STATUS_UPDATED_SUCCESS, modelData.data);
  } else if (modelData.statusCode === CONSTANTS.NOT_FOUND) {
    return apiErrorRes(req, res, CONSTANTS_MSG.NOT_FOUND);
  } else {
    return apiErrorRes(req, res, CONSTANTS_MSG.FAILURE);
  }
}
router.post('/createTask', createTask);
router.post('/getTaskList', getTaskList);
router.post('/updateTask', updateTask);
router.post('/getAllTask', getAllTask);
router.post('/updateTaskStatus', updateTaskStatus);
router.post('/deleteTask', deleteTask);

module.exports = router;