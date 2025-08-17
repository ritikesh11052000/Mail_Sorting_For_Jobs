class EmailParser {
  constructor() {
    this.keywords = {
      selection: [
        'selected', 'shortlisted', 'moved to next round', 'interview scheduled',
        'congratulations', 'happy to inform', 'pleased to inform', 'offer letter',
        'hired', 'welcome aboard', 'next step', 'technical interview',
        'hr interview', 'final round', 'assessment', 'coding challenge'
      ],
      interview: [
        'interview', 'schedule', 'availability', 'meet with', 'discussion',
        'phone call', 'video call', 'zoom meeting', 'teams meeting',
        'screening', 'technical round', 'hr round', 'final interview'
      ],
      rejection: [
        'unfortunately', 'regret to inform', 'not selected', 'not moving forward',
        'not proceed', 'rejected', 'declined', 'unsuccessful', 'not chosen',
        'not qualified', 'not fit', 'not suitable', 'position filled',
        'other candidates', 'different direction', 'no longer available'
      ],
      application: [
        'application received', 'application submitted', 'thank you for applying',
        'we have received your application', 'application confirmation',
        'applied for', 'job application', 'resume received'
      ]
    };
  }

  parseEmail(message, headers, body) {
    const subject = headers.subject || '';
    const from = headers.from || '';
    const date = new Date(parseInt(message.internalDate));
    
    const emailData = {
      id: message.id,
      threadId: message.threadId,
      subject: subject,
      from: from,
      date: date,
      company: this.extractCompanyName(subject, from, body),
      jobTitle: this.extractJobTitle(subject, body),
      status: this.determineStatus(subject, body),
      isImportant: false,
      snippet: body.substring(0, 200) + '...'
    };

    emailData.isImportant = this.isImportantEmail(emailData.status);
    
    return emailData;
  }

  extractCompanyName(subject, from) {
    // Try to extract from subject
    const subjectMatch = subject.match(/at\s+([A-Z][a-zA-Z\s]+?)(?:\s|$)/);
    if (subjectMatch) return subjectMatch[1].trim();

    // Try to extract from email domain
    const emailMatch = from.match(/@([^.]+)\./);
    if (emailMatch) {
      return emailMatch[1].charAt(0).toUpperCase() + emailMatch[1].slice(1);
    }

    return '';
  }

  extractJobTitle(subject, body) {
    const titleMatch = subject.match(/(software|engineer|developer|analyst|designer|manager|specialist)/i);
    return titleMatch ? titleMatch[0].charAt(0).toUpperCase() + titleMatch[0].slice(1) : '';
  }

  determineStatus(subject, body) {
    const lowerSubject = subject.toLowerCase();
    const lowerBody = body.toLowerCase();

    if (this.keywords.selection.some(keyword => lowerSubject.includes(keyword) || lowerBody.includes(keyword))) {
      return 'selected';
    }
    if (this.keywords.interview.some(keyword => lowerSubject.includes(keyword) || lowerBody.includes(keyword))) {
      return 'interview';
    }
    if (this.keywords.rejection.some(keyword => lowerSubject.includes(keyword) || lowerBody.includes(keyword))) {
      return 'rejected';
    }
    if (this.keywords.application.some(keyword => lowerSubject.includes(keyword) || lowerBody.includes(keyword))) {
      return 'applied';
    }
    return 'unknown';
  }

  isJobApplicationEmail(email) {
    const subject = email.subject.toLowerCase();
    const body = email.body.toLowerCase();
    
    // Check for job-related keywords
    const jobKeywords = [
      'job', 'position', 'role', 'career', 'opportunity', 'application', 'resume', 'cv',
      'interview', 'hiring', 'recruitment', 'selected', 'rejected', 'offer', 'congratulations'
    ];
    
    return jobKeywords.some(keyword => 
      subject.includes(keyword) || body.includes(keyword)
    );
  }

  filterRejectionEmails(emails) {
    return emails.filter(email => {
      const status = this.determineStatus(email.subject, email.body);
      return status !== 'rejected';
    });
  }

  extractImportantEmails(emails) {
    return emails.filter(email => {
      const status = this.determineStatus(email.subject, email.body);
      return ['selected', 'interview', 'applied'].includes(status);
    });
  }

  isImportantEmail(status) {
    return ['selected', 'interview'].includes(status);
  }
}

// Export for use in other modules
window.EmailParser = EmailParser;
