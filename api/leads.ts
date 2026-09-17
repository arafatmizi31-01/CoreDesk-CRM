export default async function handler(req: any, res: any) {
  // CORS হেডার
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, x-api-key'
  );

  // Preflight রিকোয়েস্ট হ্যান্ডেল করা
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // শুধু POST রিকোয়েস্ট এলাউ করা
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const { name, email, phone, companyName, source } = req.body || {};

    if (!name) {
      return res.status(400).json({ error: 'Name is required' });
    }

    // ইনকামিং লিড অবজেক্ট
    const newLead = {
      id: `lead-api-${Date.now()}`,
      name,
      email: email || '',
      phone: phone || '',
      companyName: companyName || 'N/A',
      source: source || 'External API',
      status: 'New',
      createdAt: new Date().toISOString(),
    };

    return res.status(200).json({
      success: true,
      message: 'Lead captured successfully',
      data: newLead,
    });
  } catch (error) {
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}