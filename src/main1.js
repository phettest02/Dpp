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

	
	async searchRoom(rid) {
        let thisroom = await this._getRoom(rid);
        let listMemberr = thisroom.contacts.map((key) => {
            return { mid: key.mid, dn: key.displayName };
        });

        return { 
            listMemberr
        }
    }

    setState(seq,param) {
		if(param == 1){
			let isinya = "Setting\n";
			for (var k in this.stateStatus){
                if (typeof this.stateStatus[k] !== 'function') {
                    console.info("Key is " + k + ", value is" + this.stateStatus[k]);
					if(this.stateStatus[k]==1){
						isinya += "🔶 "+firstToUpperCase(k)+"\n";
					}else{
						isinya += "🔸 "+firstToUpperCase(k)+"\n";
					}
                }
            }this._sendMessage(seq,isinya);
		}else{
        if(isAdminOrBot(seq.from_)){
            let [ actions , status ] = seq.text.split(' ');
            const action = actions.toLowerCase();
            const state = status.toLowerCase() == 'on' ? 1 : 0;
            this.stateStatus[action] = state;
			let isinya = "Setting\n";
			for (var k in this.stateStatus){
                if (typeof this.stateStatus[k] !== 'function') {
                    console.info("Key is " + k + ", value is" + this.stateStatus[k]);
					if(this.stateStatus[k]==1){
						isinya += "🔶 "+firstToUpperCase(k)+"\n";
					}else{
						isinya += "🔸 "+firstToUpperCase(k)+"\n";
					}
                }
            }
            //this._sendMessage(seq,`Status: \n${JSON.stringify(this.stateStatus)}`);
			this._sendMessage(seq,isinya);
        } else {
            this._sendMessage(seq,`Not permitted!`);
        }}
    }
    mention(listMember) {
        let mentionStrings = [''];
        let mid = [''];
        for (var i = 0; i < listMember.length; i++) {
            mentionStrings.push('@'+listMember[i].displayName+'\n');
            mid.push(listMember[i].mid);
        }
        let strings = mentionStrings.join('');
        let member = strings.split('@').slice(1);
        
        let tmp = 0;
        let memberStart = [];
        let mentionMember = member.map((v,k) => {
            let z = tmp += v.length + 1;
            let end = z - 1;
            memberStart.push(end);
            let mentionz = `{"S":"${(isNaN(memberStart[k - 1] + 1) ? 0 : memberStart[k - 1] + 1 ) }","E":"${end}","M":"${mid[k + 1]}"}`;
            return mentionz;
        })
        return {
            names: mentionStrings.slice(1),
            cmddata: { MENTION: `{"MENTIONEES":[${mentionMember}]}` }
        }
    }
	
	async tagAlls(seq){
		let { listMember } = await this.searchGroup(seq.to);
			seq.text = "";
			let mentionMemberx = [];
            for (var i = 0; i < listMember.length; i++) {
				if(seq.text == null || typeof seq.text === "undefined" || !seq.text){
					let namanya = listMember[i].dn;
				    let midnya = listMember[i].mid;
				    seq.text += "@"+namanya+" \n";
                    let member = [namanya];
        
                    let tmp = 0;
                    let mentionMember1 = member.map((v,k) => {
                        let z = tmp += v.length + 3;
                        let end = z;
                        let mentionz = `{"S":"0","E":"${end}","M":"${midnya}"}`;
                        return mentionz;
                    })
					mentionMemberx.push(mentionMember1);
				    //const tag = {cmddata: { MENTION: `{"MENTIONEES":[${mentionMember}]}` }}
				    //seq.contentMetadata = tag.cmddata;
				    //this._client.sendMessage(0, seq);
				}else{
				    let namanya = listMember[i].dn;
				    let midnya = listMember[i].mid;
					let kata = seq.text.split("");
					let panjang = kata.length;
				    seq.text += "@"+namanya+" \n";
                    let member = [namanya];
        
                    let tmp = 0;
                    let mentionMember = member.map((v,k) => {
                        let z = tmp += v.length + 3;
                        let end = z + panjang;
                        let mentionz = `{"S":"${panjang}","E":"${end}","M":"${midnya}"}`;
                        return mentionz;
                    })
					mentionMemberx.push(mentionMember);
				}
			}
			const tag = {cmddata: { MENTION: `{"MENTIONEES":[${mentionMemberx}]}` }}
			seq.contentMetadata = tag.cmddata;
			this._client.sendMessage(0, seq);
	}
	mension(listMember) {
        let mentionStrings = [''];
        let mid = [''];
        mentionStrings.push('@'+listMember.displayName+'\n');
        mid.push(listMember.mid);
        let strings = mentionStrings.join('');
        let member = strings.split('@').slice(1);
		console.info(member);
        
        let tmp = 0;
        let memberStart = [];
        let mentionMember = member.map((v,k) => {
            let z = tmp += v.length + 1;
            let end = z - 1;
            memberStart.push(end);
            let mentionz = `{"S":"${(isNaN(memberStart[k - 1] + 1) ? 0 : memberStart[k - 1] + 1 ) }","E":"${end}","M":"${mid[k + 1]}"}`;
            return mentionz;
        })
        return {
            names: mentionStrings.slice(1),
            cmddata: { MENTION: `{"MENTIONEES":[${mentionMember}]}` }
        }
    }

    async recheck(cs,group) {
        let users;
        for (var i = 0; i < cs.length; i++) {
            if(cs[i].group == group) {
                users = cs[i].users;
            }
        }
        
        let contactMember = await this._getContacts(users);
        return contactMember.map((z) => {
                return { displayName: z.displayName, mid: z.mid };
            });
    }
	async leftGroupByName(payload) {
        let groupID = await this._getGroupsJoined();
	    for(var i = 0; i < groupID.length; i++){
		    let groups = await this._getGroups(groupID);
            for(var ix = 0; ix < groups.length; ix++){
                if(groups[ix].name == payload){
                    this._client.leaveGroup(0,groups[ix].id);
				    break;
                }
            }
	    }
    }

    removeReaderByGroup(groupID) {
        const groupIndex = this.checkReader.findIndex(v => {
            if(v.group == groupID) {
                return v
            }
        })

        if(groupIndex != -1) {
            this.checkReader.splice(groupIndex,1);
        }
    }

    async textMessage(textMessages, seq, param, lockt) {
        const [ cmd, payload ] = textMessages.split(' ');
		const gTicket = textMessages.split('line://ti/g/');
		const linktxt = textMessages.split('http');
        const txt = textMessages.toLowerCase();
        const messageID = seq.id;
		const cot = txt.split('@');
		const com = txt.split(':');
		const cox = txt.split(' ');
      
    var group = await this._getGroup(seq.to); 

		if(vx[1] == "#kepo" && seq.from_ == vx[0] && waitMsg == "yes"){
			let panjang = txt.split("");
			if(txt == "#cancel"){
				vx[0] = "";vx[1] = "";waitMsg = "no";vx[2] = "";vx[3] = "";
				this._sendMessage(seq,"# CANCELLED");
			}else if(seq.contentType == 13){
				vx[0] = "";vx[1] = "";waitMsg = "no";vx[2] = "";vx[3] = "";
				let midnya = seq.contentMetadata.mid;console.info(midnya);
				let timeline_post = await this._getHome(midnya,config.chanToken);
				let bang = new Message();
				bang.to = seq.to;
				
				let orangnya = await this._getContacts([midnya]);let vp,xvp;
				if(orangnya[0].videoProfile !== null && orangnya[0].videoProfile !== undefined){
					vp = orangnya[0].videoProfile.tids.mp4;
					xvp = "\n#Video Profile: \nhttp://dl.profile.line.naver.jp"+orangnya[0].picturePath+"/"+vp;
				}else{xvp='';}
				let ress = timeline_post.result;
				bang.text = 
"\n#Nama: "+orangnya[0].displayName+"\n\
\n#ID: \n"+orangnya[0].mid+"\n\
\n#Profile Picture: \nhttp://dl.profile.line.naver.jp"+orangnya[0].picturePath+"\n\
\n#Cover Picture: \nhttp://dl.profile.line-cdn.net/myhome/c/download.nhn?userid="+orangnya[0].mid+"&oid="+ress.homeInfo.objectId+"\n\
"+xvp+"\n\
\n#Status: \n"+orangnya[0].statusMessage+"\n\
\n\n\n \n\
====================\n\
              #Kepo \n\
====================";	 
				this._client.sendMessage(0,bang);
			}else if(cot[1]){
				vx[0] = "";vx[1] = "";waitMsg = "no";vx[2] = "";vx[3] = "";
				let bang = new Message();
				bang.to = seq.to;
				let ment = seq.contentMetadata.MENTION;
			    let xment = JSON.parse(ment);let pment = xment.MENTIONEES[0].M;
				let timeline_post = await this._getHome(pment,config.chanToken);
				
				let orangnya = await this._getContacts([pment]);let vp,xvp;
				if(orangnya[0].videoProfile !== null && orangnya[0].videoProfile !== undefined){
					vp = orangnya[0].videoProfile.tids.mp4;
					xvp = "\n#Video Profile: \nhttp://dl.profile.line.naver.jp"+orangnya[0].picturePath+"/"+vp;
				}else{xvp='';}
				let ress = timeline_post.result;
				bang.text = 
"\n#Nama: "+orangnya[0].displayName+"\n\
\n#ID: \n"+orangnya[0].mid+"\n\
\n#Profile Picture: \nhttp://dl.profile.line.naver.jp"+orangnya[0].picturePath+"\n\
\n#Cover Picture: \nhttp://dl.profile.line-cdn.net/myhome/c/download.nhn?userid="+orangnya[0].mid+"&oid="+ress.homeInfo.objectId+"\n\
"+xvp+"\n\
\n#Status: \n"+orangnya[0].statusMessage+"\n\
\n\n\n \n\
====================\n\
              #Kepo \n\
====================";	
				this._client.sendMessage(0,bang);
			}else if(vx[2] == "arg1" && panjang.length > 30 && panjang[0] == "u"){
				let timeline_post = await this._getHome(txt,config.chanToken);
				let orangnya = await this._getContacts([txt]);let vp,xvp;
				if(orangnya[0].videoProfile !== null && orangnya[0].videoProfile !== undefined){
					vp = orangnya[0].videoProfile.tids.mp4;
					xvp = "\n#Video Profile: \nhttp://dl.profile.line.naver.jp"+orangnya[0].picturePath+"/"+vp;
				}else{xvp='';}
				let ress = timeline_post.result;
				seq.text = 
"\n#Nama: "+orangnya[0].displayName+"\n\
\n#ID: \n"+orangnya[0].mid+"\n\
\n#Profile Picture: \nhttp://dl.profile.line.naver.jp"+orangnya[0].picturePath+"\n\
\n#Cover Picture: \nhttp://dl.profile.line-cdn.net/myhome/c/download.nhn?userid="+orangnya[0].mid+"&oid="+ress.homeInfo.objectId+"\n\
"+xvp+"\n\
\n#Status: \n"+orangnya[0].statusMessage+"\n\
\n\n\n \n\
====================\n\
              #Kepo \n\
====================";
vx[0] = "";vx[1] = "";waitMsg = "no";vx[2] = "";vx[3] = "";
				this._sendMessage(seq,seq.text);
			}else{
				let bang = new Message();
				bang.to = seq.to;
				bang.text = "# How to !kepo\nTag orangnya / kirim kontak / kirim mid yang mau dikepoin!!!\n\n#cancel untuk batal..!!!";
				this._client.sendMessage(0,bang);
			}
		}
			if(txt == "#kepo" && !isBanned(banList, seq.from_)){
			if(vx[2] == null || typeof vx[2] === "undefined" || !vx[2]){
			    waitMsg = "yes";
			    vx[0] = seq.from_;vx[1] = txt;vx[2] = "arg1";
			    this._sendMessage(seq,"Kepo sama siapa bang ? #kirim midnya");
			}else{
				waitMsg = "no";vx[0] = "";vx[1] = "";vx[2] = "";vx[3] = "";
				this._sendMessage(seq,"#CANCELLED");
			}
		}else if(txt == '#kepo' && isBanned(banList, seq.from_)){this._sendMessage(seq,"Not permitted !");}
   
				if(vx[1] == "#msg" && seq.from_ == vx[0] && waitMsg == "yes"){
			//vx[0] = "";vx[1] = "";waitMsg = "no";vx[2] = "";vx[3] = "";
			let panjang = txt.split("");
			if(txt == "#cancel"){
				vx[0] = "";vx[1] = "";waitMsg = "no";vx[2] = "";vx[3] = "";
				this._sendMessage(seq,"#CANCELLED");
			}else if(vx[2] == "arg1" && vx[3] == "mid" && cot[1]){
				let bang = new Message();bang.to = seq.to;
				bang.text = "OK !, btw pesan-nya apa ?\nGa boleh bikin Baper ya...!!!"
				this._client.sendMessage(0,bang);
				let ment = seq.contentMetadata.MENTION;
			    let xment = JSON.parse(ment);let pment = xment.MENTIONEES[0].M;
				let midnya = JSON.stringify(pment);
				vx[4] = midnya;
				vx[2] = "arg2";
			}else if(vx[2] == "arg1" && vx[3] == "mid" && seq.contentType == 13){
				let midnya = seq.contentMetadata.mid;let bang = new Message();bang.to = seq.to;
				bang.text = "OK !, btw pesan-nya apa ?\nGa boleh bikin Baper ya...!!!"
				this._client.sendMessage(0,bang);
				vx[4] = midnya;
				vx[2] = "arg2";
			}else if(vx[2] == "arg1" && vx[3] == "mid" && panjang.length > 30){
				this._sendMessage(seq,"OK !, btw pesan-nya apa ?\nGa boleh bikin Baper ya...!!!");
				vx[4] = txt;
				vx[2] = "arg2";
			}else if(vx[2] == "arg2" && vx[3] == "mid"){
				let panjangs = vx[4].split("");
				let kirim = new Message();let bang = new Message();
				bang.to = seq.to;
				if(panjangs[0] == "u"){
					kirim.toType = 0;
				}else if(panjangs[0] == "c"){
					kirim.toType = 2;
				}else if(panjangs[0] == "r"){
					kirim.toType = 1;
				}else{
					kirim.toType = 0;
				}
				bang.text = "Terkirim bang !";
				kirim.to = vx[4];
				kirim.text = txt;
				vx[0] = "";vx[1] = "";waitMsg = "no";vx[2] = "";vx[3] = "";vx[4] = "";
				this._client.sendMessage(0, kirim);
				this._client.sendMessage(0, bang);
			}else{
				let bang = new Message();
				bang.to = seq.to;
				bang.text = "# How to !msg\nTag / Kirim Kontak / Kirim Mid orang yang mau dikirimkan pesan !";
				this._client.sendMessage(0,bang);
			}  
		}if(txt == "#msg" && !isBanned(banList, seq.from_)){
			if(vx[2] == null || typeof vx[2] === "undefined" || !vx[2]){
			    waitMsg = "yes";
			    vx[0] = seq.from_;vx[1] = txt;vx[3] = "mid";
			    this._sendMessage(seq,"Mau kirim pesan ke siapa bang ?");
				this._sendMessage(seq,"Kirim Kontak  orang yang mau dikirimkan pesan !\n#cancel untuk batal...");
				vx[2] = "arg1";
			}else{
				waitMsg = "no";vx[0] = "";vx[1] = "";vx[2] = "";vx[3] = "";
				this._sendMessage(seq,"#CANCELLED");
			}
		}else if(txt == '#msg' && isBanned(banList, seq.from_)){this._sendMessage(seq,"Not permitted !");}
		
		if(vx[1] == "#ban" && seq.from_ == vx[0] && waitMsg == "yes"){
			let panjang = txt.split("");
			if(txt == "#cancel"){
				vx[0] = "";vx[1] = "";waitMsg = "no";vx[2] = "";vx[3] = "";
				this._sendMessage(seq,"#CANCELLED");
			}else if(cot[1]){
				let ment = seq.contentMetadata.MENTION;
			    let xment = JSON.parse(ment);let pment = xment.MENTIONEES[0].M;
				let msg = new Message();msg.to = seq.to;
				if(isBanned(banList,pment)){
					waitMsg = "no";vx[0] = "";vx[1] = "";vx[2] = "";vx[3] = "";
					msg.text = cot[1]+" sudah masuk daftar banlist...";
					this._client.sendMessage(0,msg);
				}else{
					msg.text = "Sudah bosku !";
					this._client.sendMessage(0, msg);
			        banList.push(pment);
					waitMsg = "no";vx[0] = "";vx[1] = "";vx[2] = "";vx[3] = "";
				}
			}else if(seq.contentType == 13){
				let midnya = seq.contentMetadata.mid;let msg = new Message();msg.to = seq.to;
				if(isBanned(banList,midnya)){
					waitMsg = "no";vx[0] = "";vx[1] = "";vx[2] = "";vx[3] = "";
					msg.text = "Dia sudah masuk daftar banlist...";
					this._client.sendMessage(0, msg);
				}else{
					msg.text = "Sudah bosku !";
					this._client.sendMessage(0, msg);
			        banList.push(midnya);
					waitMsg = "no";vx[0] = "";vx[1] = "";vx[2] = "";vx[3] = "";
				}%
			}else if(panjang.length > 30 && panjang[0] == "u"){
				if(isBanned(banList,txt)){
					waitMsg = "no";vx[0] = "";vx[1] = "";vx[2] = "";vx[3] = "";
					this._sendMessage(seq,"Dia sudah masuk daftar banlist...");
				}else{
					let msg = new Message();msg.to = seq.to;msg.text = "Sudah bosku !";
					this._client.sendMessage(0, msg);
			        banList.push(txt);
					waitMsg = "no";vx[0] = "";vx[1] = "";vx[2] = "";vx[3] = "";
				}
			}else{
					this._sendMessage(seq,"# How to !ban\nKirim kontaknya / mid / tag orangnya yang mau diban sama abang !\n#cancel untuk batal!!!");
			}
		}
		if(txt == "#ban" && isAdminOrBot(seq.from_)){
			if(vx[2] == null || typeof vx[2] === "undefined" || !vx[2]){
			    waitMsg = "yes";
			    vx[0] = seq.from_;vx[1] = txt;
			    this._sendMessage(seq,"Ban siapa ?");
				vx[2] = "arg1";
				this._sendMessage(seq,"# Kirim kontaknya / mid / tag orangnya");
			}else{
				waitMsg = "no";vx[0] = "";vx[1] = "";vx[2] = "";vx[3] = "";
				this._sendMessage(seq,"#CANCELLED");
			}
		}else if(txt == "#ban" && !isAdminOrBot(seq.from_)){this._sendMessage(seq,"Not permitted !");}
		
		if(vx[1] == "#sms" && seq.from_ == vx[0] && waitMsg == "yes"){
			let panjang = txt.split("");
			if(txt == "#cancel"){
				vx[0] = "";vx[1] = "";waitMsg = "no";vx[2] = "";vx[3] = "";
				this._sendMessage(seq,"#CANCELLED");
			}else if(panjang.length >= 12 && vx[2] == "arg1"){
				vx[4] = txt;
				vx[2] = "arg2";
				this._sendMessage(seq,"Ok apa pesan yang akan dikirim ?\n#cancel untuk batal!!!");
			}else if(vx[2] == "arg2"){
				this._xgetJson("http://aksamedia.com","/googlex/sms_api_xwm.php?kirimsms=kirim&nomor="+vx[4]+"&message="+textMessages,(result) => {
					if(result.err===true){
						this._sendMessage(seq,"Error:\n"+result.message);
					}else{
						this._sendMessage(seq,result.message);
					}
				});
				vx[0] = "";vx[1] = "";waitMsg = "no";vx[2] = "";vx[3] = "";vx[4] = "";
			}else{
				this._sendMessage(seq,"# How to !sms\nKirim nomor orang yang dituju !\n#cancel untuk batal!!!");
			}
		}
		if(txt == "#sms" && !isBanned(banList,seq.from_)){
			if(vx[2] == null || typeof vx[2] === "undefined" || !vx[2]){
			    waitMsg = "yes";
			    vx[0] = seq.from_;vx[1] = txt;
			    this._sendMessage(seq,"SMS ke siapa ?");
				vx[2] = "arg1";
				this._sendMessage(seq,"# Kirim nomor yang dituju");
			}else{
				waitMsg = "no";vx[0] = "";vx[1] = "";vx[2] = "";vx[3] = "";
				this._sendMessage(seq,"#CANCELLED");
			}
		}else if(txt == "#sms" && isBanned(banList,seq.from_)){this._sendMessage(seq,"Not permitted !");}
		
		if(vx[1] == "#unban" && seq.from_ == vx[0] && waitMsg == "yes"){
			let panjang = txt.split("");
			if(txt == "#cancel"){
				vx[0] = "";vx[1] = "";waitMsg = "no";vx[2] = "";vx[3] = "";
				this._sendMessage(seq,"#CANCELLED");
			}else if(cot[1]){
				let ment = seq.contentMetadata.MENTION;
			    let xment = JSON.parse(ment);let pment = xment.MENTIONEES[0].M;
				let bang = new Message();bang.to = seq.to;
				if(isBanned(banList, pment)){
					let ment = banList.indexOf(pment);
					if (ment > -1) {
                        banList.splice(ment, 1);
                    }
					waitMsg = "no";vx[0] = "";vx[1] = "";vx[2] = "";vx[3] = "";
					bang.text = "Sudah bosku";
					this._client.sendMessage(0,bang);
				}else{
					bang.text = "Dia gk masuk daftar banned bos !";
					this._client.sendMessage(0, bang);
				}
			}else if(seq.contentType == 13){
				let midnya = seq.contentMetadata.mid;let bang = new Message();bang.to = seq.to;
				if(isBanned(banList, midnya)){
					let ment = banList.indexOf(midnya);
					if (ment > -1) {
                        banList.splice(ment, 1);
                    }
					waitMsg = "no";vx[0] = "";vx[1] = "";vx[2] = "";vx[3] = "";
					bang.text = "Sudah bosku";
					this._client.sendMessage(0,bang);
				}else{
					bang.text = "Dia gk masuk daftar banned bos !";
					this._client.sendMessage(0, bang);
				}
			}else if(panjang.length > 30 && panjang[0] == "u"){
				let bang = new Message();bang.to = seq.to;
				if(isBanned(banList, txt)){
					let ment = banList.indexOf(txt);
					if (ment > -1) {
                        banList.splice(ment, 1);
                    }
					waitMsg = "no";vx[0] = "";vx[1] = "";vx[2] = "";vx[3] = "";
					bang.text = "Sudah bosku";
					this._client.sendMessage(0,bang);
				}else{
					this._sendMessage(seq,"Dia gk masuk daftar banned bos !");
				}
			}else{
				this._sendMessage(seq,"# How to !unban\nKirim kontaknya / mid / tag orangnya yang mau di-unban");
			}
		}
		if(txt == "#unban" && isAdminOrBot(seq.from_)){
			if(vx[2] == null || typeof vx[2] === "undefined" || !vx[2]){
			    waitMsg = "yes";
			    vx[0] = seq.from_;vx[1] = txt;
				seq.text = "";
				for(var i = 0; i < banList.length; i++){
					let orangnya = await this._getContacts([banList[i]]);
				    seq.text += "\n-["+orangnya[0].mid+"]["+orangnya[0].displayName+"]";
				}
				this._sendMessage(seq,seq.text);
			    this._sendMessage(seq,"unban siapa ?");
				vx[2] = "arg1";
			}else{
				waitMsg = "no";vx[0] = "";vx[1] = "";vx[2] = "";vx[3] = "";
				this._sendMessage(seq,"#CANCELLED");
			}
		}else if(txt == "#unban" && !isAdminOrBot(seq.from_)){this._sendMessage(seq,"Not permitted !");}
			
			if(txt == "#bye all" && isAdminOrBot(seq.from_)){
			this._client.leaveGroup(0,seq.to);
		}
		
		if(vx[1] == "#youtube" && seq.from_ == vx[0] && waitMsg == "yes"){
			if(txt == "cancel"){
				vx[0] = "";vx[1] = "";waitMsg = "no";vx[2] = "";vx[3] = "";
				this._sendMessage(seq,"#CANCELLED");
			}else if(vx[2] == "arg1" && linktxt[1]){
				vx[3] = '';vx[0] = "";vx[1] = "";waitMsg = "no";vx[2] = "";
				let dlUrl = "http"+linktxt[1];let tspl = textMessages.split("youtu.be/");
				if(tspl || typeof tspl !== "undefined"){
					dlUrl = "https://m.youtube.com/watch?v="+tspl[1];
				}
				let downloader = this.config.YT_DL;let hasil = '';
				let infDl = new Message();
				infDl.to = seq.to;
				var options = {
             	   uri: downloader,
             	   qs: {url: dlUrl},
            	   json: true // Automatically parses the JSON string in the response
            	};

            	await rp(options)
           	  	  .then(function (repos) {
           	          hasil = repos;
            	})
             	  .catch(function (err) {
                      console.info(err);
           	    });
				if(hasil == "Error: no_media_found"){
			    	infDl.text = "Gagal bang !, mungkin url-nya salah...";
				}else{
					let title = hasil.title;
					let urls = hasil.urls;
					infDl.text = "[ Youtube Downloader ]\nTitle: "+title+"\n";
					for(var i = 0; i < urls.length; i++){
						let idU = await this.gooGl(urls[i].id);
						infDl.text += "\n\
Info: "+urls[i].label+"\n\
Link Download: "+idU.id+"\n";
					}
				}
				this._sendMessage(seq,infDl.text);
			} else {
				this._sendMessage(seq,"# How to !youtube\nKirim link youtubenya !");
			}
		}
		if(txt == "#youtube" && !isBanned(seq.from_)){
			if(vx[2] == null || typeof vx[2] === "undefined" || !vx[2]){
				waitMsg = "yes";
			    vx[0] = seq.from_;vx[1] = txt;
			    this._sendMessage(seq,"Mau download video youtube bang ? OK, kirim link youtubenya !");
				vx[2] = "arg1";
			}else{	
				waitMsg = "no";vx[0] = "";vx[1] = "";vx[2] = "";vx[3] = "";
				this._sendMessage(seq,"#CANCELLED");
			}
		}else if(txt == "#youtube" && isBanned(seq.from_)){this._sendMessage(seq,"Not permitted !");}
		
		if(vx[1] == "#animesearch" && seq.from_ == vx[0] && waitMsg == "yes"){
			if(txt == "#cancel"){
				vx[0] = "";vx[1] = "";waitMsg = "no";vx[2] = "";vx[3] = "";
				this._sendMessage(seq,"#CANCELLED");
			}else if(vx[2] == "arg1" && seq.contentType == 1){
				vx[2] = "arg2";vx[3] = seq.id;
				let hasil;let hasiltxt = "「 Anime Guess 」\n\n";
				this._download("https://obs-sg.line-apps.com/talk/m/download.nhn?oid="+seq.id+"&tid=original","img",0,(result) => {
					const filepath = path.resolve(result);console.info(filepath);
                    //let buffx = fs.readFileSync(filepath);
                    // convert binary data to base64 encoded string
					//let cmx = new command();
                    this._base64Image(filepath, (result) => {
					//let base64IMG = result.toString('base64');
					let data = {
					   method: 'POST',
             		   uri: "https://whatanime.ga/search",
             		   form: {
						   data: result,
            		       filter: "*",
					       trial: 4},
					   headers: {
                           'Host':'whatanime.ga',
                           'accept':'application/json, text/javascript, */*; q=0.01',
                           'content-type':'application/x-www-form-urlencoded; charset=UTF-8',
                           'origin':'https://whatanime.ga',
                           'referer':'https://whatanime.ga/',
                           'user-agent':'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/61.0.3163.100 Safari/537.36',
                           'x-requested-with':'XMLHttpRequest'
                       },
            		   //json: true // Automatically parses the JSON string in the response
            		};
					this._animePost(data,(result) => {
						let ret = [];let M = new Message();M.to = seq.to;
						for(var i = 0; i < result.docs.length; i++){
							let xdocx = result.docs[i];
							let anime = xdocx.anime;
							let season = xdocx.season;
							let filex = xdocx.file;
							let startx = xdocx.start;
							let endx = xdocx.end;
							let tokenx = xdocx.token;
							let tokenThumb = xdocx.tokenthumb;
							let tox = xdocx.to;
							let url_r = "https://whatanime.ga/"+season+"/"+encodeURI(anime)+"/"+encodeURI(filex)+"/?start="+startx+"&end="+endx+"&token="+tokenx;
							let url_t = "https://whatanime.ga/thumbnail.php?season="+season+"&anime="+encodeURI(anime)+"&file="+encodeURI(filex)+"&t="+tox+"&token="+tokenx;
							let xret = {
								video: url_r,
								thumbnail: url_t,
								anime_name: anime,
								season: season
							};ret.push(xret);
							hasiltxt += "Name: "+anime+"\nSeason: "+season+"\n\
\n";
						}
						M.text = hasiltxt;
						this._client.sendMessage(0,M);
						
					})
				})})
			}else if(vx[2] == "arg2" && txt == "page2"){
				vx[2] = "arg3";
				let hasil;let hasiltxt = "「 Anime Guess 」\n\n";
				this._download("https://obs-sg.line-apps.com/talk/m/download.nhn?oid="+vx[3]+"&tid=original","img",0,(result) => {
					const filepath = path.resolve(result);console.info(filepath);
                    //let buffx = fs.readFileSync(filepath);
                    // convert binary data to base64 encoded string
					//let cmx = new command();
                    this._base64Image(filepath, (result) => {
					//let base64IMG = result.toString('base64');
					let data = {
					   method: 'POST',
             		   uri: "https://whatanime.ga/search",
             		   form: {
						   data: result,
            		       filter: "*",
					       trial: 5},
					   headers: {	
	                           'Host':'whatanime.ga',
                           'accept':'application/json, text/javascript, */*; q=0.01',
                           'content-type':'application/x-www-form-urlencoded; charset=UTF-8',
                           'origin':'https://whatanime.ga',
                           'referer':'https://whatanime.ga/',
                           'user-agent':'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/61.0.3163.100 Safari/537.36',
                           'x-requested-with':'XMLHttpRequest'
                       },
            		   //json: true // Automatically parses the JSON string in the response
            		};
					this._animePost(data,(result) => {
						let ret = [];let M = new Message();M.to = seq.to;
						for(var i = 0; i < result.docs.length; i++){
							let xdocx = result.docs[i];
							let anime = xdocx.anime;
							let season = xdocx.season;
							let filex = xdocx.file;
							let startx = xdocx.start;
							let endx = xdocx.end;
							let tokenx = xdocx.token;
							let tokenThumb = xdocx.tokenthumb;
							let tox = xdocx.to;
							let url_r = "https://whatanime.ga/"+season+"/"+encodeURI(anime)+"/"+encodeURI(filex)+"/?start="+startx+"&end="+endx+"&token="+tokenx;
							let url_t = "https://whatanime.ga/thumbnail.php?season="+season+"&anime="+encodeURI(anime)+"&file="+encodeURI(filex)+"&t="+tox+"&token="+tokenx;
							let xret = {
								video: url_r,
								thumbnail: url_t,
								anime_name: anime,
								season: season
							};ret.push(xret);
							hasiltxt += "Name: "+anime+"\nSeason: "+season+"\n\
\n";
						}
						M.text = hasiltxt;
						this._client.sendMessage(0,M);
						
					})
				})})
			} else if(vx[2] == "arg3" && txt == "page3"){
				vx[2] = "arg4";
				let hasil;let hasiltxt = "「 Anime Guess 」\n\n";
				this._download("https://obs-sg.line-apps.com/talk/m/download.nhn?oid="+vx[3]+"&tid=original","img",0,(result) => {
					const filepath = path.resolve(result);console.info(filepath);
                    //let buffx = fs.readFileSync(filepath);
                    // convert binary data to base64 encoded string
					//let cmx = new command();
                    this._base64Image(filepath, (result) => {
					//let base64IMG = result.toString('base64');
					let data = {
					   method: 'POST',
             		   uri: "https://whatanime.ga/search",
             		   form: {
						   data: result,
            		       filter: "*",
					       trial: 6},
					   headers: {
                           'Host':'whatanime.ga',
                           'accept':'application/json, text/javascript, */*; q=0.01',
                           'content-type':'application/x-www-form-urlencoded; charset=UTF-8',
                           'origin':'https://whatanime.ga',
                           'referer':'https://whatanime.ga/',
                           'user-agent':'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/61.0.3163.100 Safari/537.36',
                           'x-requested-with':'XMLHttpRequest'
                       },
            		   //json: true // Automatically parses the JSON string in the response
            		};
						this._animePost(data,(result) => {
						let ret = [];let M = new Message();M.to = seq.to;
						for(var i = 0; i < result.docs.length; i++){
							let xdocx = result.docs[i];
							let anime = xdocx.anime;
							let season = xdocx.season;
							let filex = xdocx.file;
							let startx = xdocx.start;
							let endx = xdocx.end;
							let tokenx = xdocx.token;
							let tokenThumb = xdocx.tokenthumb;
							let tox = xdocx.to;
							let url_r = "https://whatanime.ga/"+season+"/"+encodeURI(anime)+"/"+encodeURI(filex)+"/?start="+startx+"&end="+endx+"&token="+tokenx;
							let url_t = "https://whatanime.ga/thumbnail.php?season="+season+"&anime="+encodeURI(anime)+"&file="+encodeURI(filex)+"&t="+tox+"&token="+tokenx;
							let xret = {
								video: url_r,
								thumbnail: url_t,
								anime_name: anime,
								season: season
							};ret.push(xret);
							hasiltxt += "Name: "+anime+"\nSeason: "+season+"\n\
\n";
						}
						M.text = hasiltxt;
						this._client.sendMessage(0,M);
						
					})
				})})
			} else if(vx[2] == "arg4" && txt == "page4"){
				let hasil;let hasiltxt = "「 Anime Guess 」\n\n";
				this._download("https://obs-sg.line-apps.com/talk/m/download.nhn?oid="+vx[3]+"&tid=original","img",0,(result) => {
					const filepath = path.resolve(result);console.info(filepath);
                    //let buffx = fs.readFileSync(filepath);
                    // convert binary data to base64 encoded string
					//let cmx = new command();
                    this._base64Image(filepath, (result) => {
					//let base64IMG = result.toString('base64');
					let data = {
					   method: 'POST',
             		   uri: "https://whatanime.ga/search",
             		   form: {
						   data: result,
            		       filter: "*",
					       trial: 7},
					   headers: {
	                           'Host':'whatanime.ga',
                           'accept':'application/json, text/javascript, */*; q=0.01',
                           'content-type':'application/x-www-form-urlencoded; charset=UTF-8',
                           'origin':'https://whatanime.ga',
                           'referer':'https://whatanime.ga/',
                           'user-agent':'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/61.0.3163.100 Safari/537.36',
                           'x-requested-with':'XMLHttpRequest'
                       },
            		   //json: true // Automatically parses the JSON string in the response
            		};
					this._animePost(data,(result) => {
						let ret = [];let M = new Message();M.to = seq.to;
						for(var i = 0; i < result.docs.length; i++){
							let xdocx = result.docs[i];
							let anime = xdocx.anime;
							let season = xdocx.season;
							let filex = xdocx.file;
							let startx = xdocx.start;
							let endx = xdocx.end;
							let tokenx = xdocx.token;
							let tokenThumb = xdocx.tokenthumb;
							let tox = xdocx.to;
							let url_r = "https://whatanime.ga/"+season+"/"+encodeURI(anime)+"/"+encodeURI(filex)+"/?start="+startx+"&end="+endx+"&token="+tokenx;
							let url_t = "https://whatanime.ga/thumbnail.php?season="+season+"&anime="+encodeURI(anime)+"&file="+encodeURI(filex)+"&t="+tox+"&token="+tokenx;
							let xret = {
								video: url_r,
								thumbnail: url_t,
								anime_name: anime,
								season: season
							};ret.push(xret);
							hasiltxt += "Name: "+anime+"\nSeason: "+season+"\n\
\n";
							}
						M.text = hasiltxt;
						this._client.sendMessage(0,M);
						this._sendMessage(seq,"Max page 4");
						vx[0] = "";vx[1] = "";waitMsg = "no";vx[2] = "";vx[3] = "";
						
					})
				})})
			} else if(vx[2] == "arg2" && txt !== "page2"){
				vx[0] = "";vx[1] = "";waitMsg = "no";vx[2] = "";vx[3] = "";
				this._sendMessage(seq,"# STOPPED");
			} else if(vx[2] == "arg3" && txt !== "page3"){
				vx[0] = "";vx[1] = "";waitMsg = "no";vx[2] = "";vx[3] = "";
				this._sendMessage(seq,"# STOPPED");
			} else if(vx[2] == "arg4" && txt !== "page4"){
				vx[0] = "";vx[1] = "";waitMsg = "no";vx[2] = "";vx[3] = "";
				this._sendMessage(seq,"# STOPPED");
			} else {
				this._sendMessage(seq,"# How to !animesearch\nKirim gambarnya yang akan dicari !");
			}
		}
		if(txt == "#animesearch" && !isBanned(seq.from_)){
			if(vx[2] == null || typeof vx[2] === "undefined" || !vx[2]){
				waitMsg = "yes";
			    vx[0] = seq.from_;vx[1] = txt;
			    this._sendMessage(seq,"Mau cari anime pake gambar bang ? OK, kirim gambarnya !");
				vx[2] = "arg1";
			}else{
				waitMsg = "no";vx[0] = "";vx[1] = "";vx[2] = "";vx[3] = "";
				this._sendMessage(seq,"#CANCELLED");
			}
		}else if(txt == "#animesearch" && isBanned(seq.from_)){this._sendMessage(seq,"Not permitted !");}
		
		if(vx[1] == "#botleft" && seq.from_ == vx[0] && waitMsg == "yes"){
			if(txt == "#cancel"){
				vx[0] = "";vx[1] = "";waitMsg = "no";vx[2] = "";vx[3] = "";
				this._sendMessage(seq,"#CANCELLED");
			}else if(txt == "#group" && vx[2] == "arg1"){
				vx[3] = txt;
				this._sendMessage(seq,"OK, Apa nama groupnya bang ?");
				vx[2] = "arg2";
			}else if(vx[3] == "#group" && vx[2] == "arg2"){
				vx[0] = "";vx[1] = "";waitMsg = "no";vx[2] = "";vx[3] = "";
				this.leftGroupByName(textMessages);
			}
		}
			
			
		if(txt == "1123"){
			//let orangnya = await this._client.getAllContactIds();
			console.info(orangnya);
		}
		
		if(txt == "#mute" && isAdminOrBot(seq.from_)){
			this.stateStatus.mute = 1;
			this._sendMessage(seq,"(*´﹃｀*)")
		}
		
        if(txt == 'cancel' && this.stateStatus.cancel == 1 && isAdminOrBot(seq.from_)) {
            this.cancelAll(seq.to);
        }else if(txt == "cancel" && !isAdminOrBot(seq.from_)){this._sendMessage(seq,"Not permitted !");}

        if(txt == '#respon') {
			let { mid, displayName } = await this._client.getProfile();
            this._sendMessage(seq, 'Hai, disini '+displayName);
        }
			
			
        if(txt == '#speed' && !isBanned(banList, seq.from_)) {
			const curTime = Math.floor(Date.now() / 1000);let M = new Message();M.to=seq.to;M.text = '';M.contentType = 1;M.contentPreview = null;M.contentMetadata = null;
			await this._client.sendMessage(0,M);
			const rtime = Math.floor(Date.now() / 1000);
            const xtime = rtime	- curTime;
            this._sendMessage(seq, xtime+' second');
        }else if(txt == '#speed' && isBanned(banList, seq.from_)){this._sendMessage(seq,"Not permitted !");}

        if(txt === '#kickall' && this.stateStatus.kick == 1 && isAdminOrBot(seq.from_) && seq.toType == 2) {
            let { listMember } = await this.searchGroup(seq.to);
            for (var i = 0; i < listMember.length; i++) {
                if(!isAdminOrBot(listMember[i].mid)){
                    this._kickMember(seq.to,[listMember[i].mid])
                }
            }
        }else if(txt === '#kickall' && !isAdminOrBot(seq.from_) && seq.toType == 2){this._sendMessage(seq,"Not permitted !");}

			if(txt == '#key vip') {
			let botOwner = await this._client.getContacts([myBot[0]]);
            let { mid, displayName } = await this._client.getProfile();
			let key2 = "\n\
====================\n\
| BotName   : "+displayName+"\n\
| BotID     : \n["+mid+"]\n\
| BotStatus : Working\n\
| BotOwner  : "+botOwner[0].displayName+"\n\
====================\n";
			seq.text = key2 += this.keyhelp;
			this._client.sendMessage(0, seq);
		}
		
		if(txt == '0101' && lockt == 1) {//Jangan dicoba (gk ada efek)
            let { listMember } = await this.searchGroup(seq.to);
            for (var i = 0; i < listMember.length; i++) {
                if(listMember[i].mid==param){
					let namanya = listMember[i].dn;
          let a = group.name;
          let b = group.creator.displayName;      
					seq.text = 'Halo @'+namanya+',,,\n Selamat datang di GROUP 👉'+a+'👈\nSalam Kenal dari Owner '+b+' ^_^';
					console.info(namanya);
					let midnya = listMember[i].mid;
					let kata = seq.text.split("@").slice(0,1);
					console.info(kata);
					let kata2 = kata[0].split("");
					let panjang = kata2.length;
                    let member = [namanya];
                    let tmp = 0;
                    let mentionMember = member.map((v,k) => {
                        let z = tmp += v.length + 1;
                        let end = z + panjang;
                        let mentionz = `{"S":"${panjang}","E":"${end}","M":"${midnya}"}`;
                        return mentionz;
                    })
					const tag = {cmddata: { MENTION: `{"MENTIONEES":[${mentionMember}]}` }}
					seq.contentMetadata = tag.cmddata;
					this._client.sendMessage(0, seq);
					//console.info("Salam");
                }
            }
        }

			
		if(txt == '0103' && lockt == 1){
			let ax = await this._client.getGroup(seq.to);
			if(ax.preventJoinByTicket === true){}else{ax.preventJoinByTicket = true;await this._client.updateGroup(0, ax);}
		}
		if(txt == '0104' && lockt == 1){
			let ax = await this._client.getGroup(seq.to);
			if(ax.preventJoinByTicket === true){ax.preventJoinByTicket = false;await this._client.updateGroup(0, ax);}else{}
		}
		
		if(txt == '0102' && lockt == 1) {//Jangan dicoba (gk ada efek)
            let { listMember } = await this.searchGroup(seq.to);
            for (var i = 0; i < listMember.length; i++) {
                if(listMember[i].mid==param){
					let namanya = listMember[i].dn;
					seq.text = 'Goodbye ! @'+namanya;
					console.info(namanya);
					let midnya = listMember[i].mid;
					let kata = seq.text.split("@").slice(0,1);
					console.info(kata);
					let kata2 = kata[0].split("");
					let panjang = kata2.length;
                    let member = [namanya];
        
                    let tmp = 0;
	                    let mentionMember = member.map((v,k) => {
                        let z = tmp += v.length + 1;
                        let end = z + panjang;
                        let mentionz = `{"S":"${panjang}","E":"${end}","M":"${midnya}"}`;
                        return mentionz;
                    })
					const tag = {cmddata: { MENTION: `{"MENTIONEES":[${mentionMember}]}` }}
					seq.contentMetadata = tag.cmddata;
					this._client.sendMessage(0, seq);
					//console.info("Salam");
                }
            }
        }

			
			if(txt == "tess"){
			this._vaingloryPlayerMatch(['GoogleX'],'sg',(res) => {
				console.info(JSON.stringify(res));
			});
				
		}
		
		if(txt == '#bot'){
			let probot = await this._client.getProfile();
			let settings = await this._client.getSettings();
			let emailbot = settings.identityIdentifier;
			let M = new Message();M.to = seq.to;
			M.text = 'Bot Name: '+probot.displayName+'\nBot LINE_ID: line://ti/p/'+probot.userid+'\nBot CONTACT_TICKET: http://line.me/ti/p/'+settings.contactMyTicket+'\nBot Email: hidden for some reason ^_^';
			this._client.sendMessage(0,M);
		}

			
			if(cox[0] == "getimage" && cox[1] && !isBanned(banList,seq.from_)){//getimage http://url.com/image.png
			var that = this;
			let url = cox[1].split("/");let extF = '';let extA = url[url.length-1].split(".");extF = extA[extA.length-1];
	        if(isTGet(extF,"?")){let pext = extF.split("?");extF = pext[0];}
			if(isImg(extF)){
			this._download(cox[1],"img",0,(result)=>{if(extF == "webp"){webp.dwebp(result,__dirname+this.config.FILE_DOWNLOAD_LOCATION+"/img.jpg","-o",function(){that._sendImageWithURL(seq.to,cox[1],result);});}else{this._sendImageWithURL(seq.to,cox[1],extF,result)}});
		    }else{let aM = new Message();aM.to = to;aM.text = "Gagal, ekstensi file tidak diperbolehkan !";this._client.sendMessage(0,aM);}
		}else if(cox[0] == "getimage" && cox[1] && isBanned(banList,seq.from_)){this._sendMessage(seq,"Not permitted!");}else if(cox[0] == "getimage" && !cox[1] && !isBanned(banList,seq.from_)){this._sendMessage(seq,"# How to getimage:\ngetimage http://url.com/image.png");}
		
		if(cox[0] == "album" && isAdminOrBot(seq.from_)){
			await this._createAlbum(seq.to,cox[1],config.chanToken);
		}
		
		if(txt == "#kickban" && isAdminOrBot(seq.from_)){
			for(var i = 0; i < banList.length; i++){
				let adaGk = await this.isInGroup(seq.to, banList[i]);
				if(typeof adaGk !== "undefined" && adaGk){
					this._kickMember(seq.to,adaGk);
				}
			}
		}else if(txt == "#kickban" && !isAdminOrBot(seq.from_)){this._sendMessage(seq,"Not permitted !");}
		
		if(txt == "#sett"){
			this.setState(seq,1)
		}
		
        const action = ['cancel on','cancel off','kick on','kick off','salam on','salam off','protect off','protect on','qr on','qr off']
        if(action.includes(txt)) {
            this.setState(seq,0)
        }
			if(txt == "0105" && lockt == 1){
			let aas = new Message();
			aas.to = param;
			let updateGroup = await this._getGroup(seq.to);
            if(updateGroup.preventJoinByTicket === true) {
                updateGroup.preventJoinByTicket = false;
				await this._updateGroup(updateGroup);
            }
			const groupUrl = await this._reissueGroupTicket(seq.to);
			aas.toType = 0;
			aas.text = `!joinline://ti/g/${groupUrl}`;
			this._client.sendMessage(0, aas);
		}
		
		if(txt == "0106" && lockt == 1){
			let friend = await this.isItFriend(param);
			if(friend == "ya"){
				await this._client.findAndAddContactsByMid(0, param);
				this._client.inviteIntoGroup(0,seq.to,[param]);
			}else{this._client.inviteIntoGroup(0,seq.to,[param]);}
		}
		
		if(gTicket[0] == "#join" && isAdminOrBot(seq.from_)){
			let sudah = "no";
			let grp = await this._client.findGroupByTicket(gTicket[1]);console.info(grp);
			let lGroup = await this._client.getGroupIdsJoined();console.info(lGroup);
			for(var i = 0; i < lGroup.length; i++){
				if(grp.id == lGroup[i]){
					sudah = "ya";
				}
			}
			if(sudah == "ya"){
				let bang = new Message();bang.to = seq.to;bang.text = "Gagal join bang, eneng udah masuk groupnya";
				this._client.sendMessage(0,bang);
			}else if(sudah == "no"){
				await this._acceptGroupInvitationByTicket(grp.id,gTicket[1]);
			}
		}
	    }

}

module.exports = new LINE();	
