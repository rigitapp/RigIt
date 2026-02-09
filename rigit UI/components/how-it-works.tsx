"use client";

export function HowItWorks() {
  return (
    <div className="flex flex-col items-start gap-16">
      {/* Header */}
      <div className="flex flex-col items-start gap-4">
        <div className="flex items-start gap-4">
          <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M46.2133 18.0595L41.6924 16.5526L43.8213 12.2948C44.0371 11.8492 44.1093 11.3475 44.0279 10.8591C43.9465 10.3707 43.7155 9.91955 43.3668 9.56797L38.2719 4.47303C37.9184 4.11922 37.463 3.8851 36.9695 3.80358C36.4761 3.72205 35.9696 3.79724 35.5211 4.01855L31.2633 6.14743L29.7564 1.62656C29.5972 1.15532 29.2951 0.745414 28.8921 0.453884C28.4891 0.162353 28.0053 0.00370202 27.5079 7.97379e-06H20.3319C19.8305 -0.00128648 19.3413 0.155054 18.9335 0.446932C18.5257 0.73881 18.22 1.15146 18.0595 1.62656L16.5526 6.14743L12.2948 4.01855C11.8492 3.80275 11.3475 3.73057 10.8591 3.81197C10.3707 3.89338 9.91955 4.12435 9.56797 4.47303L4.47303 9.56797C4.11922 9.92143 3.8851 10.3769 3.80358 10.8703C3.72205 11.3637 3.79724 11.8703 4.01855 12.3188L6.14743 16.5765L1.62656 18.0835C1.15532 18.2426 0.745414 18.5447 0.453884 18.9477C0.162353 19.3507 0.00370202 19.8346 7.97379e-06 20.3319V27.5079C-0.00128648 28.0094 0.155054 28.4986 0.446932 28.9063C0.73881 29.3141 1.15146 29.6198 1.62656 29.7803L6.14743 31.2873L4.01855 35.545C3.80275 35.9907 3.73057 36.4923 3.81197 36.9807C3.89338 37.4692 4.12435 37.9203 4.47303 38.2719L9.56797 43.3668C9.92143 43.7206 10.3769 43.9548 10.8703 44.0363C11.3637 44.1178 11.8703 44.0426 12.3188 43.8213L16.5765 41.6924L18.0835 46.2133C18.2439 46.6884 18.5497 47.101 18.9574 47.3929C19.3652 47.6848 19.8544 47.8411 20.3559 47.8398H27.5318C28.0333 47.8411 28.5225 47.6848 28.9303 47.3929C29.338 47.101 29.6438 46.6884 29.8042 46.2133L31.3112 41.6924L35.5689 43.8213C36.0117 44.0317 36.5085 44.1009 36.9919 44.0196C37.4754 43.9383 37.9222 43.7104 38.2719 43.3668L43.3668 38.2719C43.7206 37.9184 43.9548 37.463 44.0363 36.9695C44.1178 36.4761 44.0426 35.9696 43.8213 35.5211L41.6924 31.2633L46.2133 29.7564C46.6845 29.5972 47.0944 29.2951 47.386 28.8921C47.6775 28.4891 47.8361 28.0053 47.8398 27.5079V20.3319C47.8411 19.8305 47.6848 19.3413 47.3929 18.9335C47.101 18.5257 46.6884 18.22 46.2133 18.0595ZM43.0559 25.7857L40.1855 26.7425C39.5254 26.9566 38.9198 27.3117 38.4107 27.7832C37.9016 28.2548 37.5012 28.8314 37.2372 29.4731C36.9733 30.1149 36.8521 30.8063 36.882 31.4996C36.912 32.1929 37.0924 32.8713 37.4108 33.4879L38.7742 36.2148L36.143 38.846L33.4879 37.4108C32.8745 37.1051 32.2026 36.9349 31.5176 36.9115C30.8327 36.8882 30.1508 37.0123 29.5179 37.2754C28.8851 37.5385 28.3162 37.9345 27.8498 38.4365C27.3833 38.9386 27.0302 39.535 26.8142 40.1855L25.8574 43.0559H22.0542L21.0974 40.1855C20.8833 39.5254 20.5281 38.9198 20.0566 38.4107C19.5851 37.9016 19.0085 37.5012 18.3667 37.2372C17.725 36.9733 17.0335 36.8521 16.3402 36.882C15.647 36.912 14.9685 37.0924 14.352 37.4108L11.6251 38.7742L8.9939 36.143L10.4291 33.4879C10.7475 32.8713 10.9279 32.1929 10.9578 31.4996C10.9878 30.8063 10.8666 30.1149 10.6026 29.4731C10.3386 28.8314 9.9382 28.2548 9.42911 27.7832C8.92001 27.3117 8.31444 26.9566 7.65438 26.7425L4.78399 25.7857V22.0542L7.65438 21.0974C8.31444 20.8833 8.92001 20.5281 9.42911 20.0566C9.9382 19.5851 10.3386 19.0085 10.6026 18.3667C10.8666 17.725 10.9878 17.0335 10.9578 16.3402C10.9279 15.647 10.7475 14.9685 10.4291 14.352L9.06566 11.6968L11.6968 9.06566L14.352 10.4291C14.9685 10.7475 15.647 10.9279 16.3402 10.9578C17.0335 10.9878 17.725 10.8666 18.3667 10.6026C19.0085 10.3386 19.5851 9.9382 20.0566 9.42911C20.5281 8.92001 20.8833 8.31444 21.0974 7.65438L22.0542 4.78399H25.7857L26.7425 7.65438C26.9566 8.31444 27.3117 8.92001 27.7832 9.42911C28.2548 9.9382 28.8314 10.3386 29.4731 10.6026C30.1149 10.8666 30.8063 10.9878 31.4996 10.9578C32.1929 10.9279 32.8713 10.7475 33.4879 10.4291L36.2148 9.06566L38.846 11.6968L37.4108 14.352C37.1051 14.9654 36.9349 15.6373 36.9115 16.3222C36.8882 17.0071 37.0123 17.6891 37.2754 18.3219C37.5385 18.9547 37.9345 19.5236 38.4365 19.9901C38.9386 20.4565 39.535 20.8097 40.1855 21.0256L43.0559 21.9824V25.7857ZM23.9199 14.352C22.0276 14.352 20.1777 14.9131 18.6042 15.9645C17.0308 17.0158 15.8045 18.5101 15.0803 20.2584C14.3561 22.0067 14.1666 23.9305 14.5358 25.7865C14.905 27.6425 15.8162 29.3474 17.1544 30.6855C18.4925 32.0236 20.1973 32.9349 22.0533 33.304C23.9093 33.6732 25.8331 33.4837 27.5814 32.7596C29.3297 32.0354 30.8241 30.809 31.8754 29.2356C32.9267 27.6622 33.4879 25.8123 33.4879 23.9199C33.4879 21.3823 32.4798 18.9487 30.6855 17.1544C28.8912 15.36 26.4575 14.352 23.9199 14.352ZM23.9199 28.7039C22.9737 28.7039 22.0488 28.4233 21.2621 27.8977C20.4754 27.372 19.8622 26.6248 19.5001 25.7507C19.138 24.8765 19.0433 23.9146 19.2279 22.9866C19.4125 22.0586 19.8681 21.2062 20.5371 20.5371C21.2062 19.8681 22.0586 19.4125 22.9866 19.2279C23.9146 19.0433 24.8765 19.138 25.7507 19.5001C26.6248 19.8622 27.372 20.4754 27.8977 21.2621C28.4233 22.0488 28.7039 22.9737 28.7039 23.9199C28.7039 25.1887 28.1999 26.4055 27.3027 27.3027C26.4055 28.1999 25.1887 28.7039 23.9199 28.7039Z" fill="#BEFE46"/>
          </svg>
          <h2 className="text-white font-['IBM_Plex_Mono'] text-[40px] font-semibold">
            How it Works
          </h2>
        </div>
        <p className="text-[#A7A7A7] font-['IBM_Plex_Mono'] text-xl font-light leading-[161.8%] max-w-[1144px]">
          Each Exploration lasts 2 hours, followed by a 40-minute cooldown.
          <br />
          If minimum threshold is not met, the pool rolls over to the next round.Losers get a 50% refund of their deposited amount.
        </p>
      </div>

      {/* Pool Distribution */}
      <div className="flex flex-col items-start gap-8 self-stretch">
        <h3 className="text-white font-['IBM_Plex_Mono'] text-2xl font-medium">
          Pool Distribution
        </h3>

        <div className="w-full flex flex-col gap-4">
          {/* Losers Refund */}
          <div className="flex items-center gap-6 w-full">
            <div className="flex items-center gap-2 w-[372px]">
              <div className="w-4 h-4 bg-[#27EBFD]" />
              <span className="text-white font-['IBM_Plex_Mono'] text-xl font-medium">
                Losers Refund [of Pool Total]
              </span>
            </div>
            <div className="flex-1 h-[1px] bg-[#A7A7A7]" />
            <span className="text-white font-['IBM_Plex_Mono'] text-xl font-medium text-right w-[36px]">
              50%
            </span>
          </div>

          {/* Winner Payout */}
          <div className="flex items-center gap-6 w-full pl-[52px]">
            <div className="flex items-center gap-2 w-[564px]">
              <div className="w-4 h-4 bg-[#0DE094]" />
              <span className="text-white font-['IBM_Plex_Mono'] text-xl font-medium">
                Winner Payout [Pool Total after Loser Refund]
              </span>
            </div>
            <div className="flex-1 h-[1px] bg-[#A7A7A7]" />
            <span className="text-white font-['IBM_Plex_Mono'] text-xl font-medium text-right w-[36px]">
              50%
            </span>
          </div>

          {/* $RIG Buybacks */}
          <div className="flex items-center gap-6 w-full pl-[52px]">
            <div className="flex items-center gap-2 w-[180px]">
              <div className="w-4 h-4 bg-[#FF8F57]" />
              <span className="text-white font-['IBM_Plex_Mono'] text-xl font-medium">
                $RIG Buybacks
              </span>
            </div>
            <div className="flex-1 h-[1px] bg-[#A7A7A7]" />
            <span className="text-white font-['IBM_Plex_Mono'] text-xl font-medium text-right w-[36px]">
              30%
            </span>
          </div>

          {/* Team Operations */}
          <div className="flex items-center gap-6 w-full pl-[52px]">
            <div className="flex items-center gap-2 w-[204px]">
              <div className="w-4 h-4 bg-[#7F80EE]" />
              <span className="text-white font-['IBM_Plex_Mono'] text-xl font-medium">
                Team Operations
              </span>
            </div>
            <div className="flex-1 h-[1px] bg-[#A7A7A7]" />
            <span className="text-white font-['IBM_Plex_Mono'] text-xl font-medium text-right w-[36px]">
              10%
            </span>
          </div>

          {/* Rollover */}
          <div className="flex items-center gap-6 w-full pl-[52px]">
            <div className="flex items-center gap-2 w-[216px]">
              <div className="w-4 h-4 bg-[#FFC700]" />
              <span className="text-white font-['IBM_Plex_Mono'] text-xl font-medium">
                Rollover to Next
              </span>
            </div>
            <div className="flex-1 h-[1px] bg-[#A7A7A7]" />
            <span className="text-white font-['IBM_Plex_Mono'] text-xl font-medium text-right w-[36px]">
              10%
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
