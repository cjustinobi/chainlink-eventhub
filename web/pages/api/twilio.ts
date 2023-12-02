const accountSid = 'AC86a61e2646b04979fe45917798f0ec98'
const authToken = process.env.TWILIO_TOKEN
const client = require('twilio')(accountSid, authToken)

import type { NextApiRequest, NextApiResponse } from 'next'

type Data = {
  message: string
}

export default function handler(req: NextApiRequest, res: NextApiResponse<Data>) {

  const { body, to } = req.body

  client.messages
    .create({
      body,
      from: '+13345230641',
      to
    })
    .then((message: { sid: string; }) => {
      console.log(`Message SID: ${message.sid}`)
      res.status(200).json({message: "sent"})
    })
    .catch((error: { message: any; }) => {
      res.status(500).json({ message: error.message })
    })

    
}
