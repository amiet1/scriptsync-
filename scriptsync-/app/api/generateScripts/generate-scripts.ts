// // /pages/api/generate-script.ts
// import { NextApiRequest, NextApiResponse } from 'next';
// import prisma from '../../../prisma/prisma';
// import { generateAIScript } from '../../utils/ai-script-generator'; // Import your AI script logic

// export default async function handler(req: NextApiRequest, res: NextApiResponse) {
//   if (req.method !== 'POST') {
//     return res.status(405).json({ error: 'Method not allowed' });
//   }

//   try {
//     // Generate a new script
//     const content = await generateAIScript(); // A function that uses OpenAI or similar service to generate the script

//     // Save the script to the database
//     const newScript = await prisma.script.create({
//       data: {
//         content,
//       },
//     });

//     return res.status(200).json({ success: true, script: newScript });
//   } catch (error) {
//     console.error('Error generating script:', error);
//     return res.status(500).json({ error: 'Failed to generate script' });
//   }
// }
