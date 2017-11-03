const LineAPI = require('./api');
const request = require('request');
const fs = require('fs');
const unirest = require('unirest');
const webp = require('webp-converter');
const path = require('path');
const rp = require('request-promise');
const config = require('./config');
const { Message, OpType, Location } = require('../curve-thrift/line_types');

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
# Key ℘ṳ♭ℓ!ḉ ḉøღღᎯи∂\n\n\
=> #animesearch\n\
=> #banlist\n\
=> #bot\n\
=> #cekid\n\
=> #getimage\n\
=> #ginfo\n\
=> #gURL\n\
=> #halo\n\
=> #kepo\n\
=> #key\n\
=> #kickme\n\
=> #msg\n\
=> #myid\n\
=> #sendcontact\n\
=> #setting\n\
=> #sms\n\
=> #speed\n\
=> #vainglory\n\
=> #vainmatch\n\
=> #whattime\n\
=> #youtube\n\
===TAB #key vip ===\n\
*Untuk fitur/pengguna VIP*\n\
\n\n# Gunakan bot dengan bijak ^_^";
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
			halo.text = "ѕαℓαм кєиαℓ gєикѕ.... ^_^ !";
			this._client.sendMessage(0, halo);
		}
		if(operation.type == 5 && this.stateStatus.salam == 1) {//someone adding me..
            let halo = new Message();
			halo.to = operation.param1;
			halo.text = "Im bot..,Tq 4 add...\nMyCreator: line://ti/p/~aries_jabrik";
			this._client.sendMessage(0, halo);
        }
         if(operation.type == 19) { //ada kick
            // op1 = group nya
            // op2 = yang 'nge' kick
            // op3 = yang 'di' kick
			let kasihtau = new Message();
			kasihtau.to = operation.param1;
            if(!isAdminOrBot(operation.param3)) {
				this.textMessage("0105",kasihtau,operation.param3,1);
				var kickhim = 'yes';
            }
            if(isAdminOrBot(operation.param3)){
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
		
		if(operation.type == 11 && this.stateStatus.protect == 1){//update group (open qr)
		    let seq = new Message();
			seq.to = operation.param1;
			this.textMessage("0103",seq,operation.param2,1);
      seq.text = "Jིaིnིgིaིnི m͢a͢i͢n͢i͢n͢ Q̸͟͞R̸͟͞...!";
				    this._client.sendMessage(0, seq);
		}else if(operation.type == 11 && this.stateStatus.qr == 1){
			let seq = new Message();
			seq.to = operation.param1;
			this.textMessage("0104",seq,operation.param2,1);
		}else if(operation.type == 11 && this.stateStatus.qr == 0){
			let seq = new Message();
			seq.to = operation.param1;
			this.textMessage("0103",seq,operation.param2,1);
      seq.text = "Jིaིnིgིaིnི m͢a͢i͢n͢i͢n͢ Q̸͟͞R̸͟͞...!!!";
				    this._client.sendMessage(0, seq);
		}
          if(operation.type == 11 && this.stateStatus.protect == 1) {
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
						isinya += "🔓 "+firstToUpperCase(k)+"\n";
					}else{
						isinya += "🔒 "+firstToUpperCase(k)+"\n";
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
						isinya += "🔓 "+firstToUpperCase(k)+" \n";
					}else{
						isinya += "🔒 "+firstToUpperCase(k)+" \n";
					}
                }
            }
            //this._sendMessage(seq,`Status: \n${JSON.stringify(this.stateStatus)}`);
			this._sendMessage(seq,isinya);
        } else {
            this._sendMessage(seq,`G̉W̉ G̸͟͞a̸͟͞k̸͟͞ K̉e̠n̠a̠l̠ L̺͆o̺͆e̺͆...!!!`);
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
		
		if(vx[1] == "#sendcontact" && seq.from_ == vx[0] && waitMsg == "yes"){
			let panjang = txt.split("");
			if(txt == "#cancel"){
				vx[0] = "";vx[1] = "";waitMsg = "no";vx[2] = "";vx[3] = "";
				this._sendMessage(seq,"# CANCELLED");
			}else if(txt == "me"){
				vx[0] = "";vx[1] = "";waitMsg = "no";vx[2] = "";vx[3] = "";
				seq.text = "Me";seq.contentType = 13;
				seq.contentMetadata = { mid: seq.from_ };
				this._client.sendMessage(0, seq);
			}else if(cot[1]){
				vx[0] = "";vx[1] = "";waitMsg = "no";vx[2] = "";vx[3] = "";
				let ment = seq.contentMetadata.MENTION;
			    let xment = JSON.parse(ment);let pment = xment.MENTIONEES[0].M;
				seq.text = "Me";seq.contentType = 13;
				seq.contentMetadata = { mid: pment };
				this._client.sendMessage(0, seq);
			}else if(vx[2] == "arg1" && panjang.length > 30 && panjang[0] == "u"){
				vx[0] = "";vx[1] = "";waitMsg = "no";vx[2] = "";vx[3] = "";
				seq.text = "Me";seq.contentType = 13;
				seq.contentMetadata = { mid: txt };
				this._client.sendMessage(0, seq);
			}else{
				this._sendMessage(seq,"Tag orangnya atau kirim midnya Bos'Q..\n\n#cancel untuk batal..!!!");
			}
		}
    		if(txt == "#sendcontact" && !isBanned(banList, seq.from_)){
			if(vx[2] == null || typeof vx[2] === "undefined" || !vx[2]){
			    waitMsg = "yes";
			    vx[0] = seq.from_;vx[1] = txt;vx[2] = "arg1";
			    this._sendMessage(seq,"#Tag orangnya atau kirim midnya\n\nKetik #cancel untuk membatalkanny..!!");
			}else{
				waitMsg = "no";vx[0] = "";vx[1] = "";vx[2] = "";vx[3] = "";
				this._sendMessage(seq,"#CANCELLED");
			}
		}else if(txt == '#sendcontact' && isBanned(banList, seq.from_)){this._sendMessage(seq,"Anda masuk daftar Banned\nAkses dibatasi !");}
      
		
		if(vx[1] == "#addcontact" && seq.from_ == vx[0] && waitMsg == "yes"){
			let panjang = txt.split("");
			if(txt == "#cancel"){
				vx[0] = "";vx[1] = "";waitMsg = "no";vx[2] = "";vx[3] = "";
				this._sendMessage(seq,"# CANCELLED");
			}else if(seq.contentType == 13){
				vx[0] = "";vx[1] = "";waitMsg = "no";vx[2] = "";vx[3] = "";
				let midnya = seq.contentMetadata.mid;
				let listContacts = await this._client.getAllContactIds();
				for(var i = 0; i < listContacts.length; i++){
					if(listContacts[i] == midnya){
						vx[4] = "sudah";
						break;
					}
				}
				let bang = new Message();
				bang.to = seq.to;
				if(vx[4] == "sudah"){
					console.info("sudah");
					bang.text = "Dia sudah masuk friendlist bang, gk bisa ku add lagi !";
					this._client.sendMessage(0, bang);
				}else{
				    bang.text = "Ok bang !, Sudah ku add !";
				    await this._client.findAndAddContactsByMid(seq, midnya);
				    this._client.sendMessage(0, bang);
				}vx[4] = "";
			}else if(cot[1]){
				vx[0] = "";vx[1] = "";waitMsg = "no";vx[2] = "";vx[3] = "";
				let ment = seq.contentMetadata.MENTION;
			    let xment = JSON.parse(ment);let pment = xment.MENTIONEES[0].M;let midnya = pment;
				let listContacts = await this._client.getAllContactIds();
				for(var i = 0; i < listContacts.length; i++){
					if(listContacts[i] == midnya){
						vx[4] = "sudah";
						break;
					}
				}
				let bang = new Message();
				bang.to = seq.to;
				if(vx[4] == "sudah"){
					console.info("sudah");
					bang.text = "Dia sudah masuk friendlist bang, gk bisa ku add lagi !";
					this._client.sendMessage(0, bang);
				}else{
				    bang.text = "Ok bang !, Sudah ku add !";
				    await this._client.findAndAddContactsByMid(seq, midnya);
				    this._client.sendMessage(0, bang);
				}vx[4] = "";
			}else if(vx[2] == "arg1" && panjang.length > 30 && panjang[0] == "u"){
				vx[0] = "";vx[1] = "";waitMsg = "no";vx[2] = "";vx[3] = "";
				let midnya = txt;
				let listContacts = await this._client.getAllContactIds();
				for(var i = 0; i < listContacts.length; i++){
					if(listContacts[i] == midnya){
						vx[4] = "sudah";
						break;
					}
				}
				let bang = new Message();
				bang.to = seq.to;
				if(vx[4] == "sudah"){
					console.info("sudah");
					bang.text = "Dia sudah masuk friendlist bang, gk bisa ku add lagi !";
					this._client.sendMessage(0, bang);
				}else{
				    bang.text = "Ok bang !, Sudah ku add !";
				    await this._client.findAndAddContactsByMid(seq, midnya);
				    this._client.sendMessage(0, bang);
				}vx[4] = "";
			}else{
				let bang = new Message();
				bang.to = seq.to;
				bang.text = "# How to !addcontact\n-Kirim Contact Orang Yang Mau Di Add\n-Kirim Mid Orang Yang Mau Di Add\n-Atau Tag Orang Yang Mau Di Add";
				this._client.sendMessage(0,bang);
			}
		}
		if(txt == "#addcontact" && isAdminOrBot(seq.from_)){
			if(vx[2] == null || typeof vx[2] === "undefined" || !vx[2]){
			    waitMsg = "yes";
			    vx[0] = seq.from_;vx[1] = txt;vx[2] = "arg1";
			    this._sendMessage(seq,"Kontaknya siapa bang ? #Tag orangnya atau kirim kontaknya\n\n#cancel untuk membatalkan ny...!!!");
			}else{
				waitMsg = "no";vx[0] = "";vx[1] = "";vx[2] = "";vx[3] = "";
				this._sendMessage(seq,"#CANCELLED");
			}
		}else if(txt == '#addcontact' && !isAdminOrBot(seq.from_)){this._sendMessage(seq,"Akses Terbatas...\nHanya untuk ADMIN..!!");
		}else if(txt == '#addcontact' && isBanned(banList, seq.from_)){this._sendMessage(seq,"Anda masuk daftar Banned\nAkses dibatasi..!!!");}
     
		
		if(vx[1] == "#cekid" && seq.from_ == vx[0] && waitMsg == "yes"){
			let panjang = txt.split("");
			if(txt == "#cancel"){
				vx[0] = "";vx[1] = "";waitMsg = "no";vx[2] = "";vx[3] = "";
				this._sendMessage(seq,"# CANCELLED");
			}else if(seq.contentType == 13){
				vx[0] = "";vx[1] = "";waitMsg = "no";vx[2] = "";vx[3] = "";
				let midnya = seq.contentMetadata.mid;
				let bang = new Message();
				bang.to = seq.to;
				bang.text = midnya;
				this._client.sendMessage(0, bang);
			}else if(txt == "me"){
				vx[0] = "";vx[1] = "";waitMsg = "no";vx[2] = "";vx[3] = "";
				seq.text = seq.from_.toString();
				this._client.sendMessage(0, seq);
			}else if(cot[1]){
				vx[0] = "";vx[1] = "";waitMsg = "no";vx[2] = "";vx[3] = "";
				let cekid = new Message();
				cekid.to = seq.to;
				let ment = seq.contentMetadata.MENTION;
			    let xment = JSON.parse(ment);let pment = xment.MENTIONEES[0].M;
				
				cekid.text = JSON.stringify(pment).replace(/"/g , "");
				this._client.sendMessage(0, cekid);
			}else{
				let bang = new Message();
				bang.to = seq.to;
				bang.text = "How to !cekid...\nTag orangnya / kirim kontak yang mau di-cek idnya..\nKetik #cancel untuk batal..!!";
				this._client.sendMessage(0,bang);
			}
		}
		if(txt == "#cekid" && !isBanned(banList, seq.from_)){
			if(vx[2] == null || typeof vx[2] === "undefined" || !vx[2]){
			    waitMsg = "yes";
			    vx[0] = seq.from_;vx[1] = txt;vx[2] = "arg1";
			    this._sendMessage(seq,"Cek ID siapa bang ? #Kirim kontaknya");
				this._sendMessage(seq,"Atau bisa juga @tag orangnya");
			}else{
				waitMsg = "no";vx[0] = "";vx[1] = "";vx[2] = "";vx[3] = "";
				this._sendMessage(seq,"#CANCELLED");
			}
		}else if(txt == '#cekid' && isBanned(banList, seq.from_)){this._sendMessage(seq,"Anda masuk daftar Banned\nAkses dibatasi..!!!");}
		
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
				}
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
					this._sendMessage(seq,"# How to !ban\nKirim kontaknya / mid / tag orangnya yang mau diban sama abang !");
			}
		}  
		if(txt == "#ban" && isAdminOrBot(seq.from_)){
			if(vx[2] == null || typeof vx[2] === "undefined" || !vx[2]){
			    waitMsg = "yes";
			    vx[0] = seq.from_;vx[1] = txt;
			    this._sendMessage(seq,"Ban siapa ?");
				vx[2] = "arg1";
				this._sendMessage(seq,"# Kirim kontaknya / mid / tag orangnya...\n\nKetik #cancel untuk batal...!!!");
			}else{
				waitMsg = "no";vx[0] = "";vx[1] = "";vx[2] = "";vx[3] = "";
				this._sendMessage(seq,"#CANCELLED");
			}
		}else if(txt == "#ban" && !isAdminOrBot(seq.from_)){this._sendMessage(seq,"Akses Terbatas...\khusus admin..!!!");}


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
			    this._sendMessage(seq,"unban siapa...?\n\nKetik #cancel untuk batal..!!!");
				vx[2] = "arg1";
			}else{
				waitMsg = "no";vx[0] = "";vx[1] = "";vx[2] = "";vx[3] = "";
				this._sendMessage(seq,"#CANCELLED");
			}
		}else if(txt == "#unban" && !isAdminOrBot(seq.from_)){this._sendMessage(seq,"Not permitted !");}

		if(txt == "#bye" && isAdminOrBot(seq.from_)){
			this._client.leaveGroup(0,seq.to);
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
        }else if(txt == "!cancel" && !isAdminOrBot(seq.from_)){this._sendMessage(seq,"Not permitted !");}

        if(txt == '#respon') {
			let { mid, displayName } = await this._client.getProfile();
            this._sendMessage(seq, 'Hai, disini '+displayName);
        }

        if(txt === '#kickall' && this.stateStatus.kick == 1 && isAdminOrBot(seq.from_) && seq.toType == 2) {
            let { listMember } = await this.searchGroup(seq.to);
            for (var i = 0; i < listMember.length; i++) {
                if(!isAdminOrBot(listMember[i].mid)){
                    this._kickMember(seq.to,[listMember[i].mid])
                }
            }
        }else if(txt === '#kickall' && !isAdminOrBot(seq.from_) && seq.toType == 2){this._sendMessage(seq,"Not permitted !");}
		
		if(txt == '#key') {
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
					seq.text = 'Halo @'+namanya+', Selamat datang bro ! Salam Kenal ^_^';
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
	
        if(txt == '#myid' /*|| txt == 'mid' || txt == 'id'*/) {
            this._sendMessage(seq,"ID Kamu: "+seq.from_);
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
			//	await this._client.findAndAddContactsByMid(0, param);
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
