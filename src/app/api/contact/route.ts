import { NextRequest, NextResponse } from 'next/server';
import ContactMessage from '@/models/ContactMessage';
import { withContactRateLimit, getClientIP } from '@/middleware/rateLimit';

// İletişim mesajı gönder (public)
async function sendContactMessage(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, subject, message } = body;

    // Validation
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'İsim, email ve mesaj gereklidir' },
        { status: 400 }
      );
    }

    // Email format kontrolü
    const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Geçerli bir email adresi giriniz' },
        { status: 400 }
      );
    }

    // IP adresi ve user agent bilgilerini al
    const ipAddress = getClientIP(request);
    const userAgent = request.headers.get('user-agent') || '';

    const contactMessage = new ContactMessage({
      name,
      email,
      subject,
      message,
      ipAddress,
      userAgent
    });

    await contactMessage.save();

    return NextResponse.json({
      success: true,
      message: 'Mesajınız başarıyla gönderildi'
    }, { status: 201 });

  } catch (error) {
    console.error('Contact API Error:', error);
    return NextResponse.json(
      { error: 'Mesaj gönderilemedi' },
      { status: 500 }
    );
  }
}

// Tüm mesajları getir (admin only)
async function getContactMessages(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const isRead = searchParams.get('isRead');

    const skip = (page - 1) * limit;

    const filter: any = {};
    if (isRead !== null) {
      filter.isRead = isRead === 'true';
    }

    const [messages, total] = await Promise.all([
      ContactMessage.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      ContactMessage.countDocuments(filter)
    ]);

    const totalPages = Math.ceil(total / limit);

    return NextResponse.json({
      messages,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1
      }
    });

  } catch (error) {
    console.error('Contact Messages API Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Rate limiting uygula
export const POST = withContactRateLimit(sendContactMessage);
export const GET = withContactRateLimit(getContactMessages); 