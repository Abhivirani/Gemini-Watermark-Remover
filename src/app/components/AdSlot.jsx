/* MONETIZATION: Replace the div below with your Google AdSense ad unit.
   AdSense code format: <ins class="adsbygoogle" ...></ins>
   Do not remove the min-height constraint — it prevents layout shift. */

import './AdSlot.css';

export default function AdSlot({ position, hidden }) {
  return (
    <div className={`ad-slot-container ${hidden ? 'ad-hidden' : ''}`}>
      <div className={`ad-slot ad-slot-${position}`}>
        Advertisement
      </div>
    </div>
  );
}
