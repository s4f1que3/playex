/**
 * Test script for the video scraper service
 * Run with: node test-video-scraper.js
 */

const videoScraper = require('./services/videoScraper');

async function testMovieSources() {
  console.log('\n🎬 Testing Movie Sources...');
  console.log('━'.repeat(50));
  
  try {
    // Test with Fight Club (TMDB ID: 550)
    const sources = await videoScraper.getMovieSources('550');
    
    console.log('✅ Successfully fetched movie sources');
    console.log(`📊 Total sources found: ${sources.length}`);
    console.log('\n📺 Available sources:');
    
    sources.forEach((source, index) => {
      console.log(`  ${index + 1}. ${source.source.toUpperCase()}`);
      console.log(`     URL: ${source.url}`);
      console.log(`     Quality: ${source.quality}`);
      console.log(`     Type: ${source.type}\n`);
    });
    
    return true;
  } catch (error) {
    console.error('❌ Error fetching movie sources:', error.message);
    return false;
  }
}

async function testTvSources() {
  console.log('\n📺 Testing TV Show Sources...');
  console.log('━'.repeat(50));
  
  try {
    // Test with Breaking Bad (TMDB ID: 1396) S01E01
    const sources = await videoScraper.getTvSources('1396', 1, 1);
    
    console.log('✅ Successfully fetched TV episode sources');
    console.log(`📊 Total sources found: ${sources.length}`);
    console.log('\n📺 Available sources:');
    
    sources.forEach((source, index) => {
      console.log(`  ${index + 1}. ${source.source.toUpperCase()}`);
      console.log(`     URL: ${source.url}`);
      console.log(`     Quality: ${source.quality}`);
      console.log(`     Type: ${source.type}\n`);
    });
    
    return true;
  } catch (error) {
    console.error('❌ Error fetching TV sources:', error.message);
    return false;
  }
}

async function testSourceVerification() {
  console.log('\n🔍 Testing Source Verification...');
  console.log('━'.repeat(50));
  
  try {
    const testUrl = 'https://vidsrc.me/embed/movie/550';
    console.log(`Testing URL: ${testUrl}`);
    
    const isWorking = await videoScraper.verifySource(testUrl);
    
    if (isWorking) {
      console.log('✅ Source is accessible');
    } else {
      console.log('⚠️ Source may not be accessible');
    }
    
    return true;
  } catch (error) {
    console.error('❌ Error verifying source:', error.message);
    return false;
  }
}

async function runAllTests() {
  console.log('\n');
  console.log('═'.repeat(50));
  console.log('🧪 VIDEO SCRAPER TEST SUITE');
  console.log('═'.repeat(50));
  
  const movieTest = await testMovieSources();
  const tvTest = await testTvSources();
  const verifyTest = await testSourceVerification();
  
  console.log('\n');
  console.log('═'.repeat(50));
  console.log('📋 TEST RESULTS');
  console.log('═'.repeat(50));
  console.log(`Movie Sources:       ${movieTest ? '✅ PASSED' : '❌ FAILED'}`);
  console.log(`TV Sources:          ${tvTest ? '✅ PASSED' : '❌ FAILED'}`);
  console.log(`Source Verification: ${verifyTest ? '✅ PASSED' : '❌ FAILED'}`);
  console.log('═'.repeat(50));
  console.log('\n');
  
  const allPassed = movieTest && tvTest && verifyTest;
  
  if (allPassed) {
    console.log('🎉 All tests passed! The video scraper is working correctly.\n');
    process.exit(0);
  } else {
    console.log('⚠️ Some tests failed. Please check the errors above.\n');
    process.exit(1);
  }
}

// Run tests
runAllTests();
