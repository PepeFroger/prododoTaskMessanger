import {makeAutoObservable} from 'mobx'

export default class TaskStore{
	constructor(){
		this._task = [
			{id:1, name: 'JFJFJF', description: "sdfsdfsdf", timeDeadline:"12:12:12", dateDeadline:'2025-06-12', isCompleted: false, createdAt:"2025-06-03 20:39:19.616+03", updatedAt:"2025-06-03 20:39:19.616+03", deleteAt:null,},
			{id:2, name: 'JFJFJF', description: "sdfsdfsdf", timeDeadline:"12:12:12", dateDeadline:'2025-06-12', isCompleted: false, createdAt:"2025-06-03 20:39:19.616+03", updatedAt:"2025-06-03 20:39:19.616+03", deleteAt:null,},
			{id:3, name: 'JFJFJF', description: "sdfsdfsdf", timeDeadline:"12:12:12", dateDeadline:'2025-06-12', isCompleted: false, createdAt:"2025-06-03 20:39:19.616+03", updatedAt:"2025-06-03 20:39:19.616+03", deleteAt:null,},
			{id:4, name: 'JFJFJF', description: "sdfsdfsdf", timeDeadline:"12:12:12", dateDeadline:'2025-06-12', isCompleted: false, createdAt:"2025-06-03 20:39:19.616+03", updatedAt:"2025-06-03 20:39:19.616+03", deleteAt:null,},
		]
		this._subtask = [
			{id:1, name:"adaddd", isCompleted:false },
			{id:2, name:"adaddd", isCompleted:false },
			{id:3, name:"adaddd", isCompleted:false },
			{id:4, name:"adaddd", isCompleted:false },
			{id:5, name:"adaddd", isCompleted:false },
			{id:6, name:"adaddd", isCompleted:false },
		]
		makeAutoObservable(this)
	}
	setTask(task){
		this._task= task
	}
	setSubtask(subtask){
		this._subtask= subtask
	}

	get task(){
		return this._task
	}
	get subtask(){
		return this._subtask
	}


}