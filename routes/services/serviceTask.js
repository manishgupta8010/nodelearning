const db = require('../../db'),
    global_fun = require('../../utils/globalFunction'),
    CONSTANTS = require('../../utils/constants');
let Task = db.Task;
let resultdb = global_fun.resultdb;


let getTaskById = async (id) => {
    try {
        let tempTask = await Task.findOne({
            _id: id.toString()
        });
        if (tempTask === null) {
            return resultdb(CONSTANTS.NOT_FOUND, CONSTANTS.DATA_NULL)
        } else {
            return resultdb(CONSTANTS.SUCCESS, tempTask)
        }
    } catch (error) {
        return resultdb(CONSTANTS.SERVER_ERROR, CONSTANTS.DATA_NULL)
    }
};
let getTaskByName = async (data) => {
    try {
        let tempdata = await Task.findOne({
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
let saveTask = async (data) => {
    console.log("save data:------------------- ",data)
    try {
        let testTask = new Task(data);
        let responnse = await testTask.save();
        return resultdb(CONSTANTS.SUCCESS, responnse)
    } catch (error) {
        console.log("there are the catch error", error);

        if (error.code)
            return resultdb(error.code, CONSTANTS.DATA_NULL)
        return resultdb(CONSTANTS.SERVER_ERROR, CONSTANTS.DATA_NULL);
    }
};
let getTaskList = async (data) => {
    try {
        let query = {};
        if (data.keyWord && data.keyWord !== '') {
            query = { 'title': { '$regex': data.keyWord, '$options': 'i' } };
        }
        let total = await Task.countDocuments(query);
        let resData = await Task.find(query)
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
let getAllTask = async (data) => {
    try {
        let resData = await Task.find({ "name": { "$exists": true } }).select({ "name": 1, "_id": 1 }).sort({ name: 1 });
        return resultdb(CONSTANTS.SUCCESS, resData)
    } catch (error) {
        console.log(error);

        return resultdb(CONSTANTS.SERVER_ERROR, CONSTANTS.DATA_NULL)
    }
};
let getTaskTemp = async () => {
    try {
        let resData = await Task.find();
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
    getTaskById,
    saveTask,
    getTaskByName,
    getAllTask,
    getTaskTemp,
    getTaskList
};