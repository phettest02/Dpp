const LineConnect = require('./connect');
const LINE = require('./main1.js');
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
	authToken: 'Em4j2IpuhJK93xHozhwc.gKNmfN4Xb4jMn6sGbsZUZa.JjnLAE40V9Cq0541BNgroyutUZqiGLjuYABqPxC3h2Q=',
	certificate: 'e951d28c16c0b03f58057d66586626e349191cca2732d4acfd800ea09cae284c',
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
		// LINE.aLike() " (without quotes) 
	}
});
