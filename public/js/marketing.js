// public/js/marketing.js
class MarketingManager {
  constructor() {
    this.init();
  }

  init() {
    this.bindCampaignForm();
    this.bindSocialPoster();
    this.bindLandingBuilder();
  }

  bindCampaignForm() {
    const form = document.getElementById('campaign-form');
    if (form) {
      form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = new FormData(form);
        
        try {
          const response = await fetch('/marketing/campaigns/create', {
            method: 'POST',
            body: formData
          });
          
          if (response.ok) {
            window.location.reload();
          }
        } catch (error) {
          console.error('Error creating campaign:', error);
        }
      });
    }
  }

  bindSocialPoster() {
    const postBtn = document.getElementById('post-now-btn');
    const scheduleBtn = document.getElementById('schedule-post-btn');
    
    if (postBtn) {
      postBtn.addEventListener('click', async () => {
        const platforms = Array.from(document.querySelectorAll('input[name="platforms"]:checked'))
          .map(cb => cb.value);
        const message = document.getElementById('post-message').value;
        const mediaUrl = document.getElementById('post-media').value;
        
        const response = await fetch('/marketing/social-poster/post', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ platforms, message, mediaUrl })
        });
        
        const result = await response.json();
        if (result.success) {
          alert('Post published successfully!');
          window.location.reload();
        } else {
          alert('Error posting to some platforms');
        }
      });
    }
  }

  bindLandingBuilder() {
    const buildBtn = document.getElementById('build-landing-btn');
    if (buildBtn) {
      buildBtn.addEventListener('click', async () => {
        const title = document.getElementById('landing-title').value;
        const subtitle = document.getElementById('landing-subtitle').value;
        const ctaText = document.getElementById('cta-text').value;
        const ctaLink = document.getElementById('cta-link').value;
        const imageUrl = document.getElementById('landing-image').value;
        const colorScheme = document.getElementById('color-scheme').value;
        
        const response = await fetch('/marketing/landing-builder/create', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ title, subtitle, ctaText, ctaLink, imageUrl, colorScheme })
        });
        
        const result = await response.json();
        if (result.success) {
          document.getElementById('landing-result').innerHTML = `
            <div class="alert alert-success">
              <p>Landing page created! <a href="${result.url}" target="_blank">View Page</a></p>
              <p>Embed Code: <code>${result.embedCode}</code></p>
            </div>
          `;
        }
      });
    }
  }
}

// Initialize marketing manager
document.addEventListener('DOMContentLoaded', () => {
  window.marketing = new MarketingManager();
});
