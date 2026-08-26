const https = require('https');

function followRedirects(url, maxRedirects = 5, current = 0) {
  if (current >= maxRedirects) {
    console.log('Too many redirects!');
    return;
  }
  
  console.log(`\nFetching: ${url}`);
  
  const req = https.get(url, {
    headers: {
      'Cookie': 'sb-zsczxkuybmdszdlyaop-auth-token=base64-fake-token' // Fake cookie
    }
  }, (res) => {
    console.log(`Status: ${res.statusCode}`);
    console.log('Headers:', res.headers);
    
    if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
      const nextUrl = new URL(res.headers.location, url).href;
      console.log(`-> Redirecting to: ${nextUrl}`);
      followRedirects(nextUrl, maxRedirects, current + 1);
    } else {
      console.log('Final response reached or no redirect.');
    }
  }).on('error', (e) => {
    console.error(`Error: ${e.message}`);
  });
}

followRedirects('https://encontrei-one.vercel.app/login');
