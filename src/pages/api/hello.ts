// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

async function handler(req: any, res: any) {
	if (req.method === 'OPTIONS') {
		res.setHeader('Access-Control-Allow-Methods', 'POST,GET,OPTIONS')
		res.setHeader('Access-Control-Allow-Origin', '*')
		res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')
		return res.status(200).end()
	}

  if(req.method=="POST"){

    console.log(req.headers);

    return res.send(200)


  }

}

export default handler;
