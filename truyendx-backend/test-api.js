const axios = require('axios');

const BASE_URL = 'http://localhost:8000';

async function testAPIs() {
  console.log('🧪 Testing API endpoints...\n');

  try {
    // Test Featured Series
    console.log('1. Testing GET /api/series/featured');
    const featuredResponse = await axios.get(`${BASE_URL}/api/series/featured`);
    console.log('✅ Featured Series:', featuredResponse.data.data?.length || 0, 'items');
    console.log('Sample:', featuredResponse.data.data?.[0]?.title || 'No data');

    // Test Homepage Series
    console.log('\n2. Testing GET /api/series/homepage');
    const homepageResponse = await axios.get(`${BASE_URL}/api/series/homepage?limit=10&page=1`);
    console.log('✅ Homepage Series:', homepageResponse.data.data?.length || 0, 'items');
    console.log('Total:', homepageResponse.data.total || 0);
    console.log('Sample:', homepageResponse.data.data?.[0]?.title || 'No data');

    // Test Top Series
    console.log('\n3. Testing GET /api/series/top');
    const topResponse = await axios.get(`${BASE_URL}/api/series/top?type=rating&limit=7`);
    console.log('✅ Top Series:', topResponse.data.data?.length || 0, 'items');
    console.log('Sample:', topResponse.data.data?.[0]?.title || 'No data');

    // Test Latest Chapters
    console.log('\n4. Testing GET /api/series/latest-chapters');
    const chaptersResponse = await axios.get(`${BASE_URL}/api/series/latest-chapters?limit=10&page=0`);
    console.log('✅ Latest Chapters:', chaptersResponse.data.data?.length || 0, 'items');
    console.log('Sample:', chaptersResponse.data.data?.[0]?.title || 'No data');

    // Test Comments
    console.log('\n5. Testing GET /api/comments');
    const commentsResponse = await axios.get(`${BASE_URL}/api/comments?limit=10`);
    console.log('✅ Comments:', commentsResponse.data.data?.length || 0, 'items');
    console.log('Sample:', commentsResponse.data.data?.[0]?.content?.substring(0, 50) || 'No data');

    console.log('\n🎉 All API tests completed successfully!');
    console.log('\nReadiness Summary:');
    console.log('- Featured Series API: ✅ Working');
    console.log('- Homepage Series API: ✅ Working');
    console.log('- Top Series API: ✅ Working');
    console.log('- Latest Chapters API: ✅ Working');
    console.log('- Comments API: ✅ Working');
    console.log('\n🚀 Frontend should now work without MangaDx API!');

  } catch (error) {
    console.error('❌ API Test failed:');
    console.error('URL:', error.config?.url);
    console.error('Status:', error.response?.status);
    console.error('Message:', error.message);
    console.error('Data:', error.response?.data);
  }
}

// Wait for server to start
setTimeout(testAPIs, 5000);
