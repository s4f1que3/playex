import React from 'react';

const FAQ = () => {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="bg-gray-800 rounded-lg p-6 shadow-lg">
        <h1 className="text-3xl font-bold text-white mb-6">Frequently Asked Questions</h1>
        <div className="text-gray-300 space-y-6">
          <p className="text-sm text-gray-400">Last Updated: March 9, 2025</p>
          
          <section>
            <h2 className="text-2xl font-semibold text-white mb-3">1. How can I request to add Movies/TV-Shows?</h2>
            <p>As Playex doesn't manually host any media but rather uses an embedded player, we currently cannot add any movies or TV shows to our site. We are limited to the media that the embedded player has. However, in the future, we may add other embedded players that allow you to switch if one doesn't have what you want.</p>
          </section>
          
          <section>
            <h2 className="text-2xl font-semibold text-white mb-3">2. Why is the player not working?</h2>
            <p>The embedded player may not be working for a few reasons:</p>
            <ul className="list-disc pl-6 mt-2 space-y-1">
              <li><strong>Ad blockers</strong> - If you currently have any ad blockers active, this may interrupt the fetching process of the embedded player. Disable them on our site, close the site tab, re-access it, and try again.</li>
              <li><strong>WI-FI Issues</strong> - Ensure your internet connection is working.</li>
              <li><strong>Wait 2-3 Minutes</strong> - Sometimes, the player may have an interruption fetching the data to play the media. Give the player 2-3 minutes to resolve this issue and play your media.</li>
              <li>Additionally, if none of these work, try reloading the page. If that still doesn't work, contact us at <a href="mailto:contact.playex@gmail.com" className="text-[#82BC87] hover:text-[#E4D981]">contact.playex@gmail.com</a>, describe your issue, and we will resolve this ASAP.</li>
            </ul>
          </section>
          
          <section>
            <h2 className="text-2xl font-semibold text-white mb-3">3. Do I need an account to watch movies or TV shows?</h2>
            <p>Yes. You need to signup to watch movies and TV-Shows on our website. The reason for this is that signing up is necessary for the features of our website to work, including but not limited to:</p>
            <ul className="list-disc pl-6 mt-2 space-y-1">
              <li>Watch History</li>
              <li>Favorites</li>
              <li>Watch Later</li>
              <li>User preferences</li>
            </ul>
          </section>
          
          <section>
            <h2 className="text-2xl font-semibold text-white mb-3">4. Why are there ads on the player?</h2>
            <p>Ads are controlled by the embedded player providers, not by us. We do not place or manage these ads. You can try using a pop-up blocker to reduce unwanted ads, but avoid blocking core site functionality.</p>
          </section>
          
          <section>
            <h2 className="text-2xl font-semibold text-white mb-3">5. How do I report a problem with a movie or TV show?</h2>
            <p>If a video isn't working, has missing episodes, or the quality is poor, you can report it by contacting us at <a href="mailto:contact.playex@gmail.com" className="text-[#82BC87] hover:text-[#E4D981]">contact.playex@gmail.com</a>. Be sure to include the title, season/episode (if applicable), and a brief description of the issue.</p>
          </section>
          
          <section>
            <h2 className="text-2xl font-semibold text-white mb-3">6. Will you add a download feature?</h2>
            <p>Currently, we do not offer downloads, as our platform is based on streaming via embedded players. However, we may explore this option in the future if permitted.</p>
          </section>
          
          <section>
            <h2 className="text-2xl font-semibold text-white mb-3">7. Is Playex legal?</h2>
            <p>Playex does not host any media files. We use publicly available embedded players from third-party sources. We do not control or distribute content; we only provide access to what is already available online.</p>
          </section>
          
          <section>
            <h2 className="text-2xl font-semibold text-white mb-3">8. Why is the quality on the player bad?</h2>
            <p>To fix the quality issue, click the settings icon on the bottom right, click quality, and upgrade the quality to your preference. Currently, the highest quality available is 1080p.</p>
            <p className="mt-2">However, on some movies and/or TV-Shows, higher qualities may not yet be available. You would need to wait until they are to fix the quality.</p>
            <p className="mt-2">Additionally, you might find on new movies and tv-shows, that you may select a higher/ the highest quality and the quality is still in CAM. To resolve this, you would have to wait until the media is released in proper quality.</p>
          </section>
          
          <section>
            <h2 className="text-2xl font-semibold text-white mb-3">9. Should I be concerned with signing up?</h2>
            <p>We understand that you may be a bit reluctant to signup with your email to use our site. However, we assure you that your email is 100% safe with us. We do not spam you, send promotional content, or any of those other annoying and pesky things. If it does ease your worries, you can create an alt Gmail account using a different name and other information.</p>
          </section>
          
          <p className="mt-8 text-center">Contact us at <a href="mailto:contact.playex@gmail.com" className="text-[#82BC87] hover:text-[#E4D981]">contact.playex@gmail.com</a> for any further questions.</p>
        </div>
      </div>
    </div>
  );
};

export default FAQ;