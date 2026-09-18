import React from 'react';

export default function Contact() {
  return (
    <div className="card">
      <h2 style={{ marginBottom: '1rem' }}>Contact Support</h2>
      <p>If you need help with your tasks, feel free to reach out to our support team.</p>
      <form style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem' }}>
        <input type="email" placeholder="Your Email" className="input" />
        <textarea placeholder="Message" className="input" rows="4"></textarea>
        <button type="button" className="btn btn-primary" style={{ alignSelf: 'flex-start' }}>Send Message</button>
      </form>
    </div>
  );
}
