fetch('https://cmoney-book.vercel.app/api/v1/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'nonexistent@test.com', password: 'test' })
}).then(async res => {
    console.log('STATUS:', res.status, res.statusText);
    console.log('CONTENT-TYPE:', res.headers.get('content-type'));
    console.log('BODY:', await res.text());
}).catch(console.error);
