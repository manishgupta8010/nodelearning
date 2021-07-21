const express = require('express');
const router = express.Router();
const Joi = require('joi');
const globalFunction = require('../../utils/globalFunction');
const servicePublisher = require('../services/servicePublisher');
const CONSTANTS = require('../../utils/constants');
const CONSTANTS_MSG = require('../../utils/constantsMessage');
const apiSuccessRes = globalFunction.apiSuccessRes;
const apiErrorRes = globalFunction.apiErrorRes;


async function createPublisher(req, res) {

  const registerParamSchema = Joi.object({
    name: Joi.string().required(),
    address: Joi.string().required(),
    mobile: Joi.number().required(),
  });
  try {
    await registerParamSchema.validate(req.body, {
      abortEarly: true
    });
  } catch (error) {
    return apiErrorRes(req, res, error.details[0].message);
  }
  // console.log('req.body: ',req.body)
  let modelData = await servicePublisher.getPublisherByName(req.body.name);
  // console.log("modelData:",modelData)
  if (modelData.statusCode === CONSTANTS.SUCCESS) {
    return apiErrorRes(req, res, "Publisher already available!");
  } else if (modelData.data == null) {
    let modeldataRes = await servicePublisher.savePublisher(req.body);
    if (modeldataRes.statusCode == CONSTANTS.SUCCESS) {
      return apiSuccessRes(req, res, CONSTANTS_MSG.SUCCESS, modeldataRes.data);
    } else if (modeldataRes.statusCode == 11000) {
      return apiErrorRes(req, res, "Publisher already available!");
    } else {
      return apiErrorRes(req, res, CONSTANTS_MSG.FAILURE);
    }
  } else {
    return apiErrorRes(req, res, CONSTANTS_MSG.FAILURE);
  }
}
async function getPublisherList(req, res) {

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
  let resData = await servicePublisher.getPublisherList(req.body);

  if (resData.statusCode === CONSTANTS.SUCCESS) {

    return apiSuccessRes(req, res, 'Success', resData.data);
  } else {
    return apiErrorRes(req, res, 'Restaurent not found.', []);
  }
}
async function getAllPublisher(req, res) {
  let resData = await servicePublisher.getAllPublisher();
  if (resData.statusCode === CONSTANTS.SUCCESS) {
    return apiSuccessRes(req, res, 'Success', resData.data);
  } else {
    return apiErrorRes(req, res, 'Restaurent not found.', []);
  }
}
async function updatePublisher(req, res) {

  const registerParamSchema = Joi.object({
    id: Joi.string().required(),
    name: Joi.string().required(),
    address: Joi.string().required(),
    mobile: Joi.number().required(),
  });

  try {
    await registerParamSchema.validate(req.body, {
      abortEarly: true
    });
  } catch (error) {
    return apiErrorRes(req, res, error.details[0].message);
  }
  let modelData = await servicePublisher.getPublisherById(req.body.id);
  
  if (modelData.statusCode === CONSTANTS.SUCCESS) {
    modelData.data.name = req.body.name;
    modelData.data.address = req.body.address;
    modelData.data.mobile = req.body.mobile;
    await modelData.data.save();
    return apiSuccessRes(req, res, CONSTANTS_MSG.PROFILE_PASSWORD_SUCCESS, modelData.data);
  } else if (modelData.statusCode === CONSTANTS.NOT_FOUND) {
    return apiErrorRes(req, res, CONSTANTS_MSG.NOT_FOUND);
  } else {
    return apiErrorRes(req, res, CONSTANTS_MSG.FAILURE);
  }
}
async function deletePublisher(req, res) {

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
  let modelData = await servicePublisher.getPublisherById(req.body.id);
  if (modelData.statusCode === CONSTANTS.SUCCESS) {
    await modelData.data.remove();
    return apiSuccessRes(req, res, CONSTANTS_MSG.DELETE_SUCCESS);
  } else if (modelData.statusCode === CONSTANTS.NOT_FOUND) {
    return apiErrorRes(req, res, CONSTANTS_MSG.NOT_FOUND);
  } else {
    return apiErrorRes(req, res, CONSTANTS_MSG.FAILURE);
  }
}
async function updatePublisherStatus(req, res) {

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
  let modelData = await servicePublisher.getPublisherById(req.body.id);
  if (modelData.statusCode === CONSTANTS.SUCCESS) {
    modelData.data.isActive = !modelData.data.isActive;
    await modelData.data.save();
    return apiSuccessRes(req, res, CONSTANTS_MSG.SUCCESS, modelData.data);
  } else if (modelData.statusCode === CONSTANTS.NOT_FOUND) {
    return apiErrorRes(req, res, CONSTANTS_MSG.NOT_FOUND);
  } else {
    return apiErrorRes(req, res, CONSTANTS_MSG.FAILURE);
  }
}
router.post('/createPublisher', createPublisher);
router.post('/getPublisherList', getPublisherList);
router.post('/updatePublisher', updatePublisher);
router.post('/getAllPublisher', getAllPublisher);
router.post('/updatePublisherStatus', updatePublisherStatus);
router.post('/deletePublisher', deletePublisher);

module.exports = router;