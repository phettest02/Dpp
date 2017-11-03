const LineAPI = require('./api');
const request = require('request');
const fs = require('fs');
const unirest = require('unirest');
const webp = require('webp-converter');
const path = require('path');
const rp = require('request-promise');
const config = require('./config');
const { Message, OpType, Location } = require('../curve-thrift/line_types');
//let exec = require('child_process').exec;

const myBot = ['u17ce7606c05a31e55cfccb35487cfbf3','u2e8a00457a4f6a0e37b3140609cc7a95','u1a49cc167e3107826637a4a0052ceecc','u848339da8f4d7925af4edef909fc075f','u364ca880ccef9f2440b283c41ad098f9'];
const banList = [];//Banned list
var vx = {};var midnornama,pesane,kickhim;var waitMsg = "no";//DO NOT CHANGE THIS
const imgArr = ['png','jpg','jpeg','gif','bmp','webp'];//DO NOT CHANGE THIS
var komenTL = "AutoLike by 􀰂􀰂􀰂􀰂􀠁􀠁􀠁🍃🍁Ariys🍁🍃 􀂳􏿿\nline://ti/p/~aries_jabrik"; //Comment for timeline
var bcText = "TEST.";
var limitposts = '20'; //Output timeline post

function isAdminOrBot(param) {
    return myBot.includes(param);
}

function isBanned(banList, param) {
    return banList.includes(param);
}

function firstToUpperCase(str) {
    return str.substr(0, 1).toUpperCase() + str.substr(1);
}

function isTGet(string,param){
	return string.includes(param);
}

function isImg(param) {
    return imgArr.includes(param);
}

function ambilKata(params, kata1, kata2){
    if(params.indexOf(kata1) === false) return false;
    if(params.indexOf(kata2) === false) return false;
    let start = params.indexOf(kata1) + kata1.length;
    let end = params.indexOf(kata2, start);
    let returns = params.substr(start, end - start);
    return returns;
}

class LINE extends LineAPI {
    constructor() {
        super();
		this.limitposts = limitposts; //Output timeline post
        this.receiverID = '';
        this.checkReader = [];
        this.stateStatus = {
			autojoin: 0, //0 = No, 1 = Yes
            cancel: 0, //0 = Auto cancel off, 1 = on
            kick: 0, //1 = Yes, 0 = No
			mute: 0, //1 = Mute, 0 = Unmute
			protect: 0, //Protect Qr,Kicker
			qr: 0, //0 = Gk boleh, 1 = Boleh
			salam: 1 //1 = Yes, 0 = No
        }
		this.keyhelp = "\n\
====================\n\
# Key VྂIྂPྂ ḉøღღᎯи∂\n\n\
=> !addcontact *ADMIN*\n\
=> !ban *ADMIN*\n\
=> !botleft *ADMIN*\n\
=> broadcast *ADMIN*\n\
=> !kickban *ADMIN*\n\
=> !kickall *ADMIN*\n\
=> !mute *ADMIN*\n\
=> !unmute *ADMIN*\n\
=> !unban *ADMIN*\n\
\n\n*Sྂaྂlྂaྂmྂ Kྂoྂmྂpྂaྂkྂ dr Եҽɑʍ ⇉⇉『Дﾌ↹乃¤₮』⇇⇇\n\
\n# Gunakan bot dengan bijak ^_^";
        var that = this;
    }

    getOprationType(operations) {
        for (let key in OpType) {
            if(operations.type == OpType[key]) {
                if(key !== 'NOTIFIED_UPDATE_PROFILE') {
                    console.info(`[* ${operations.type} ] ${key} `);
                }
            }
        }
    }
    
    poll(operation) {
        if(operation.type == 25 || operation.type == 26) {
			console.info(operation.message);
            const txt = (operation.message.text !== '' && operation.message.text != null ) ? operation.message.text : '' ;
            let message = new Message(operation.message);
            this.receiverID = message.to = (operation.message.to === myBot[0]) ? operation.message.from_ : operation.message.to ;
            Object.assign(message,{ ct: operation.createdTime.toString() });
            if(waitMsg == "yes" && operation.message.from_ == vx[0] && this.stateStatus.mute != 1){
				console.info("Wait MSG");
				this.textMessage(txt,message,message.text)
			}else if(this.stateStatus.mute != 1){this.textMessage(txt,message);
			}else if(txt == "#unmute" && isAdminOrBot(operation.message.from_) && this.stateStatus.mute == 1){
			    this.stateStatus.mute = 0;
			    this._sendMessage(message,"ヽ(^。^)ノ")
		    }else{console.info("muted");}
        }

        if(operation.type == 13 && this.stateStatus.cancel == 1 && !isAdminOrBot(operation.param2)) {//someone inviting..
            this.cancelAll(operation.param1);
        }
		
		if(operation.type == 53 || operation.type == 43 || operation.type == 41 || operation.type == 24 || operation.type == 15 || operation.type == 21){console.info(operation);}
		
		if(operation.type == 16 && this.stateStatus.salam == 1){//join group
			let halo = new Message();
			halo.to = operation.param1;
			halo.text = "Եҽɑʍ ⇉⇉『Дﾌ↹乃¤₮』⇇⇇...\nհɑժíɾ ʍҽʍҍɑղԵմ ցɾմԹ ɑղժɑ...!!!";
			this._client.sendMessage(0, halo);
		}
		
		if(operation.type == 17 && this.stateStatus.salam == 1 && isAdminOrBot(operation.param2)) {//ada yang join
		    let halobos = new Message();
			halobos.to = operation.param1;
			halobos.toType = 2;
			halobos.text = "B͙o͙s͙'Q͙ d͙a͙t͙a͙n͙g͙..,l͙g͙s͙g͙ k͙a͙s͙i͙h͙ s͙a͙m͙b͙u͙t͙a͙n͙..!!!";
			this._client.sendMessage(0, halobos);
		}else if(operation.type == 17 && this.stateStatus.salam == 1){//ada yang join
			let seq = new Message();
			seq.to = operation.param1;
			//halo.siapa = operation.param2;
			this.textMessage("0101",seq,operation.param2,1);
			//this._client.sendMessage(0, halo);
		}   
    
		if(operation.type == 15 && isAdminOrBot(operation.param2)) {//ada yang leave
		    let babay = new Message();
			babay.to = operation.param1;
			babay.toType = 2;
			babay.text = "B͙o͙s͙'Q͙...,k͙n͙p͙a͙ n͙g͙a͙m͙b͙e͙k͙...???";
			this._invite(operation.param1,[operation.param2]);
			this._client.sendMessage(0, babay);
		}else if(operation.type == 15 && !isAdminOrBot(operation.param2)){
			let seq = new Message();
			seq.to = operation.param1;
			this.textMessage("0102",seq,operation.param2,1);
		}
		
		if(operation.type == 5 && this.stateStatus.salam == 1) {//someone adding me..
            let halo = new Message();
			halo.to = operation.param1;
			halo.text = "Creator: line://ti/p/~aries_jabrik";
			this._client.sendMessage(0, halo);
        }

        if(operation.type == 19) { //ada kick
            // op1 = group nya
            // op2 = yang 'nge' kick
            // op3 = yang 'di' kick
			let kasihtau = new Message();
			kasihtau.to = operation.param1;
            if(isAdminOrBot(operation.param3)) {
                this._kickMember(operation.param1,[operation.param2]);
                this._invite(operation.param1,[operation.param3]);    
       // this._inviteIntoGroup(operation.param1,operation.param3);
				kasihtau.text = "Jangan kick temenku..!!!";
				this._client.sendMessage(0, kasihtau);
        //this.textMessage("0105",kasihtau,operation.param3,1);
			//	var kickhim = 'yes';
            }
            if(!isAdminOrBot(operation.param3)){
				this.textMessage("0106",kasihtau,operation.param3,1);
				if(!isAdminOrBot(operation.param2)){
				//	kasihtau.text = "Jangan main kick !";
				    this._client.sendMessage(0, kasihtau);
				}
				if(this.stateStatus.protect == 1){
					var kickhim = 'yes';
				}
            } 
			if(kickhim=='yes'){
				if(!isAdminOrBot(operation.param2)){
				    this._kickMember(operation.param1,[operation.param2]);
				}var kickhim = 'no';
			}

        }  
        
            if(!isAdminOrBot(operation.param2)) {
                this._kickMember(operation.param1,[operation.param2]);
            }
        }
     

        if(operation.type == 55){ //ada reader

		    console.info(operation);
            const idx = this.checkReader.findIndex((v) => {
                if(v.group == operation.param1) {
                    return v
                }
            })
            if(this.checkReader.length < 1 || idx == -1) {
                this.checkReader.push({ group: operation.param1, users: [operation.param2], timeSeen: [operation.param3] });
            } else {
                for (var i = 0; i < this.checkReader.length; i++) {
                    if(this.checkReader[i].group == operation.param1) {
                        if(!this.checkReader[i].users.includes(operation.param2)) {
                            this.checkReader[i].users.push(operation.param2);
                            this.checkReader[i].timeSeen.push(operation.param3);
                        }
                    }
                }
            }
        }

		if(operation.type == 11 && this.stateStatus.protect == 1){//update group (open qr)
		    let seq = new Message();
			seq.to = operation.param1;
			this.textMessage("0103",seq,operation.param2,1);
      seq.text = "ᗰO ᑎGǟքǟi̥ͦn̥ͦ...!";
				    this._client.sendMessage(0, seq);     
		}else if(operation.type == 11 && this.stateStatus.qr == 1){
			let seq = new Message();
			seq.to = operation.param1;
			this.textMessage("0104",seq,operation.param2,1);
		}else if(operation.type == 11 && this.stateStatus.qr == 0){
			let seq = new Message();
			seq.to = operation.param1;
			this.textMessage("0103",seq,operation.param2,1);
       seq.text = "ᗰO ᑎGǟքǟi̥ͦn̥ͦ..!";
				    this._client.sendMessage(0, seq);        
		}
      
        if(operation.type == 11 && this.stateStatus.protect == 1) {
        if(operation.type == 13) { // diinvite
            if(this.stateStatus.autojoin == 1 || isAdminOrBot(operation.param2)) {
                return this._acceptGroupInvitation(operation.param1);
            } else {
                return this._cancel(operation.param1,operation.param2);
            }
        }
        this.getOprationType(operation);
    }
	
	async aLike(){
		if(config.chanToken && config.doing == "no"){
			config.doing = "ya";
		    this._autoLike(config.chanToken,limitposts,komenTL);
		}
	}

    async cancelAll(gid) {
        let { listPendingInvite } = await this.searchGroup(gid);
        if(listPendingInvite.length > 0){
            this._cancel(gid,listPendingInvite);
        }
    }

    async searchGroup(gid) {
        let listPendingInvite = [];
        let thisgroup = await this._getGroups([gid]);
        if(thisgroup[0].invitee !== null) {
            listPendingInvite = thisgroup[0].invitee.map((key) => {
                return key.mid;
            });
        }
        let listMember = thisgroup[0].members.map((key) => {
            return { mid: key.mid, dn: key.displayName };
        });

        return { 
            listMember,
            listPendingInvite
        }
    }
	
	async matchPeople(param, nama) {//match name
	    for (var i = 0; i < param.length; i++) {
            let orangnya = await this._client.getContacts([param[i]]);
		    if(orangnya[0].displayName == nama){
			    return orangnya;
				break;
		    }
        }
	}
	
	async isInGroup(param, mid) {
		let { listMember } = await this.searchGroup(param);
	    for (var i = 0; i < listMember.length; i++) {
		    if(listMember[i].mid == mid){
			    return listMember[i].mid;
				break;
		    }
        }
	}
	
	async isItFriend(mid){
		let listFriends = await this._getAllContactIds();let friend = "no";
		for(var i = 0; i < listFriends.length; i++){
			if(listFriends[i] == mid){
				friend = "ya";break;
			}
		}
		return friend;
	}

        
