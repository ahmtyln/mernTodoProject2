import Task from "../models/Task.js"
import createError from "../utils/createError.js";

export const createTask = async (req,res,next) => {
    try {
        const newTask = new Task({
            title: req.body.title,
            user: req.user.id,
            completed: req.body.completed
        });
        const savedTask = await newTask.save();
        return res.status(201).json(savedTask)
    } catch (error) {
        return next(error);
    }
}

export const getAllTasks = async (req,res,next) => {
    try {
        const tasks = await Task.find({});
        return res.status(200).json(tasks)
    } catch (error) {
        return next(error)
    }
}

export const getCurrentUserTask = async (req,res,next) =>{
    try {
        const tasks = await Task.find({user:req.user.id})
        return res.status(200).json(tasks)
    } catch (error) {
        return next(err)
    }
}

export const updateTask = async (req,res,next) => {
  try {
    const task = await Task.findById(req.params.taskId).exec();
    if(!task){
        return next(createError({status:404, message:"No task Found"}))
    }
    if(task.user.toString() !== req.user.id){
        return next(createError({status:401, message:"It is not your task"}))
    }
    const updatedTask = await Task.findByIdAndUpdate(req.params.taskId,{
        title:req.body.title,
        completed:req.body.completed
    },{new:true});

    return res.status(200).json(updatedTask)
  } catch (error) {
    return next(error);
  }
}

export const deleteTask = async (req,res,next) => {
    try {
        const task = await Task.findById(req.params.taskId).exec();
    if(!task){
        return next(createError({status:404, message:"No task Found"}))
    }
    if(task.user.toString() !== req.user.id){
        return next(createError({status:401, message:"It is not your task"}))
    }

    await Task.findByIdAndDelete(req.params.taskId);

    return res.status(200).json("Task deleted successfully");
    } catch (error) {
        return next(error)
    }
}
