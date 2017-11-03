const LineConnect = require('./connect');
const LINE = require('./main.js');
console.info("\n\
=========================================\n\
BotName: LINE Alphat JS\n\
Version: FORKED VERSION\n\
Thanks to @Alfathdirk @TCR_TEAM\n\
=========================================\n\
\nNOTE : This bot is made by @Alfathdirk @TCR_TEAM and has been forked by @GoogleX !\n\
***Copyright belongs to the author***");

/*
| This constant is for auth/login
| 
| Change it to your authToken / your email & password
*/
const auth = {
	authToken: 'EmL882UGnSJ9HJ0b8BF5.lOOarxPpAG43SXqgcCX6Lq.GgkkEFYVbT/pP/ciSuTCYX1wr5DB5tDhcRhKWOAefkI=',
	certificate: '34f55a0bb49e271e0ee32d502f86f3750e28c8b61ec0ddd33f2809112c4f9108',
	email: '',
	password: ''
}

//let client =  new LineConnect();
let client =  new LineConnect(auth);


client.startx().then(async (res) => {
	while(true) {
		try {
			ops = await client.fetchOps(res.operation.revision);
		} catch(error) {
			console.log('error',error)
		}
		for (let op in ops) {
			if(ops[op].revision.toString() != -1){
				res.operation.revision = ops[op].revision;
				LINE.poll(ops[op])
			}
		}
		//LINE.aLike() //AutoLike (CAUSE LAG)
	}
});
