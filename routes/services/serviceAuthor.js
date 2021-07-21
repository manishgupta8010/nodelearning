const db = require('../../db'),
    global_fun = require('../../utils/globalFunction'),
    CONSTANTS = require('../../utils/constants');
let Author = db.Author;
let resultdb = global_fun.resultdb;


let getAuthorById = async (id) => {
    try {
        let tempAuthor = await Author.findOne({
            _id: id.toString()
        });
        if (tempAuthor === null) {
            return resultdb(CONSTANTS.NOT_FOUND, CONSTANTS.DATA_NULL)
        } else {
            return resultdb(CONSTANTS.SUCCESS, tempAuthor)
        }
    } catch (error) {
        return resultdb(CONSTANTS.SERVER_ERROR, CONSTANTS.DATA_NULL)
    }
};
let getAuthorByName = async (title) => {
    try {
        let tempdata = await Author.findOne({
            title: title
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
let saveAuthor = async (data) => {
    console.log("save data:------------------- ",data)
    try {
        let testAuthor = new Author(data);
        let responnse = await testAuthor.save();
        return resultdb(CONSTANTS.SUCCESS, responnse)
    } catch (error) {
        console.log("there are the catch error", error);

        if (error.code)
            return resultdb(error.code, CONSTANTS.DATA_NULL)
        return resultdb(CONSTANTS.SERVER_ERROR, CONSTANTS.DATA_NULL);
    }
};
let getAuthorList = async (data) => {
    try {
        let query = {};
        if (data.keyWord && data.keyWord !== '') {
            query = { 'title': { '$regex': data.keyWord, '$options': 'i' } };
        }
        let total = await Author.countDocuments(query);
        let resData = await Author.find(query)
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
let getAllAuthor = async (data) => {
    try {
        let resData = await Author.find({ "title": { "$exists": true } }).select({ "title": 1,"desc": 1,"videoLink": 1,"imageLink": 1, "_id": 1 }).sort({ title: 1 });
        return resultdb(CONSTANTS.SUCCESS, resData)
    } catch (error) {
        console.log(error);

        return resultdb(CONSTANTS.SERVER_ERROR, CONSTANTS.DATA_NULL)
    }
};
let getAuthorTemp = async () => {
    try {
        let resData = await Author.find();
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
    getAuthorById,
    saveAuthor,
    getAuthorByName,
    getAllAuthor,
    getAuthorTemp,
    getAuthorList
};