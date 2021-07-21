const db = require('../../db'),
    global_fun = require('../../utils/globalFunction'),
    CONSTANTS = require('../../utils/constants');
let Publisher = db.Publisher;
let resultdb = global_fun.resultdb;


let getPublisherById = async (id) => {
    try {
        let tempPublisher = await Publisher.findOne({
            _id: id.toString()
        });
        if (tempPublisher === null) {
            return resultdb(CONSTANTS.NOT_FOUND, CONSTANTS.DATA_NULL)
        } else {
            return resultdb(CONSTANTS.SUCCESS, tempPublisher)
        }
    } catch (error) {
        return resultdb(CONSTANTS.SERVER_ERROR, CONSTANTS.DATA_NULL)
    }
};
let getPublisherByName = async (data) => {
    try {
        let tempdata = await Publisher.findOne({
            name: data
        });
        // console.log("tempdata::::",tempdata)
        if (tempdata === null) {
            return resultdb(CONSTANTS.NOT_FOUND, CONSTANTS.DATA_NULL)
        } else {
            return resultdb(CONSTANTS.SUCCESS, tempdata)
        }
    } catch (error) {
        console.log("error  ", error);

        return resultdb(CONSTANTS.SERVER_ERROR, CONSTANTS.DATA_NULL)
    }
};
let savePublisher = async (data) => {
    console.log("save data:------------------- ",data)
    try {
        let testPublisher = new Publisher(data);
        let responnse = await testPublisher.save();
        return resultdb(CONSTANTS.SUCCESS, responnse)
    } catch (error) {
        console.log("there are the catch error", error);

        if (error.code)
            return resultdb(error.code, CONSTANTS.DATA_NULL)
        return resultdb(CONSTANTS.SERVER_ERROR, CONSTANTS.DATA_NULL);
    }
};
let getPublisherList = async (data) => {
    try {
        let query = {};
        if (data.keyWord && data.keyWord !== '') {
            query = { 'title': { '$regex': data.keyWord, '$options': 'i' } };
        }
        let total = await Publisher.countDocuments(query);
        let resData = await Publisher.find(query)
            .skip(data.size * (data.pageNo - 1)).limit(data.size).sort({ createdAt: -1 });
        let tempData = {
            total: total,
            list: resData
        }
        return resultdb(CONSTANTS.SUCCESS, tempData)
    } catch (error) {
        console.log(error);

        return resultdb(CONSTANTS.SERVER_ERROR, CONSTANTS.DATA_NULL)
    }
};
let getAllPublisher = async (data) => {
    try {
        let resData = await Publisher.find({ "name": { "$exists": true } }).select({ "name": 1, "_id": 1 }).sort({ name: 1 });
        return resultdb(CONSTANTS.SUCCESS, resData)
    } catch (error) {
        console.log(error);

        return resultdb(CONSTANTS.SERVER_ERROR, CONSTANTS.DATA_NULL)
    }
};
let getPublisherTemp = async () => {
    try {
        let resData = await Publisher.find();
        if (resData === null) {
            return resultdb(CONSTANTS.NOT_FOUND, CONSTANTS.DATA_NULL)
        } else {
            return resultdb(CONSTANTS.SUCCESS, resData[0])
        }
    } catch (error) {
        return resultdb(CONSTANTS.SERVER_ERROR, CONSTANTS.DATA_NULL)
    }
};
module.exports = {
    getPublisherById,
    savePublisher,
    getPublisherByName,
    getAllPublisher,
    getPublisherTemp,
    getPublisherList
};