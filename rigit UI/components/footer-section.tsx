"use client";

import Link from "next/link";

function XIcon() {
  return (
    <svg viewBox="0 0 25 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      <path fillRule="evenodd" clipRule="evenodd" d="M24.54 24L14.9433 10.0124L14.9597 10.0255L23.6125 0H20.721L13.6721 8.16L8.0745 0H0.491L9.4505 13.0593L9.4494 13.0582L0 24H2.8916L10.7282 14.9215L16.9565 24H24.54ZM6.9288 2.1818L20.3936 21.8182H18.1022L4.6265 2.1818H6.9288Z" fill="currentColor"/>
    </svg>
  );
}

function TelegramIcon() {
  return (
    <svg viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      <path d="M12.3 0C5.5104 0 0 5.5104 0 12.3C0 19.0896 5.5104 24.6 12.3 24.6C19.0896 24.6 24.6 19.0896 24.6 12.3C24.6 5.5104 19.0896 0 12.3 0ZM18.0072 8.364C17.8227 10.3074 17.0232 15.0306 16.6173 17.2077C16.4451 18.1302 16.1007 18.4377 15.7809 18.4746C15.0675 18.5361 14.5263 18.0072 13.8375 17.5521C12.7551 16.8387 12.1401 16.3959 11.0946 15.7071C9.8769 14.9076 10.6641 14.4648 11.3652 13.7514C11.5497 13.5669 14.6985 10.701 14.76 10.4427C14.7685 10.4036 14.7674 10.363 14.7567 10.3244C14.746 10.2858 14.726 10.2504 14.6985 10.2213C14.6247 10.1598 14.5263 10.1844 14.4402 10.1967C14.3295 10.2213 12.6075 11.3652 9.2496 13.6284C8.7576 13.9605 8.3148 14.1327 7.9212 14.1204C7.4784 14.1081 6.642 13.8744 6.0147 13.6653C5.2398 13.4193 4.6371 13.284 4.6863 12.8535C4.7109 12.6321 5.0184 12.4107 5.5965 12.177C9.1881 10.6149 11.5743 9.5817 12.7674 9.0897C16.1868 7.6629 16.8879 7.4169 17.3553 7.4169C17.4537 7.4169 17.6874 7.4415 17.835 7.5645C17.958 7.6629 17.9949 7.7982 18.0072 7.8966C17.9949 7.9704 18.0195 8.1918 18.0072 8.364Z" fill="currentColor"/>
    </svg>
  );
}

function GithubIcon() {
  return (
    <svg viewBox="0 0 25 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      <path d="M12.2979 0C10.6829 0 9.0838 0.318103 7.5917 0.936121C6.0997 1.55414 4.7439 2.46003 3.602 3.602C1.2957 5.9083 0 9.0363 0 12.2979C0 17.7336 3.5295 22.3453 8.4118 23.981C9.0267 24.0793 9.2234 23.6981 9.2234 23.3661V21.2877C5.8169 22.0256 5.0913 19.6398 5.0913 19.6398C4.5256 18.2132 3.7263 17.832 3.7263 17.832C2.6072 17.0695 3.8124 17.0941 3.8124 17.0941C5.0421 17.1802 5.6939 18.3608 5.6939 18.3608C6.7639 20.2301 8.5717 19.6767 9.2726 19.3815C9.3833 18.5822 9.7031 18.0411 10.0474 17.7336C7.3173 17.4262 4.4518 16.3685 4.4518 11.683C4.4518 10.318 4.9192 9.2234 5.7185 8.3503C5.5956 8.0428 5.1651 6.7639 5.8415 5.1036C5.8415 5.1036 6.8745 4.7716 9.2234 6.358C10.195 6.0875 11.2526 5.9522 12.2979 5.9522C13.3432 5.9522 14.4009 6.0875 15.3724 6.358C17.7213 4.7716 18.7543 5.1036 18.7543 5.1036C19.4307 6.7639 19.0003 8.0428 18.8773 8.3503C19.6767 9.2234 20.144 10.318 20.144 11.683C20.144 16.3808 17.2663 17.4139 14.5238 17.7213C14.9666 18.1025 15.3724 18.8527 15.3724 19.9964V23.3661C15.3724 23.6981 15.5692 24.0916 16.1964 23.981C21.0786 22.333 24.5958 17.7336 24.5958 12.2979C24.5958 10.6829 24.2778 9.0838 23.6597 7.5917C23.0417 6.0997 22.1358 4.7439 20.9939 3.602C19.8519 2.46 18.4962 1.55414 17.0041 0.936121C15.5121 0.318103 13.9129 0 12.2979 0Z" fill="currentColor"/>
    </svg>
  );
}

export function FooterSection() {
  return (
    <footer className="relative w-full h-[710px] overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 w-full h-full">
        <img
          src="https://api.builder.io/api/v1/image/assets/TEMP/93ab1b95add48222dad92c4e390803e6cbe749ba?width=2880"
          alt=""
          className="w-full h-full object-cover"
        />
      </div>

      {/* Radial Gradient Overlay */}
      <div
        className="absolute inset-0 w-full h-full mix-blend-hard-light"
        style={{
          background:
            "radial-gradient(50% 50% at 50% 50%, rgba(1, 1, 1, 0.10) 0%, rgba(1, 1, 1, 0.95) 100%)",
        }}
      />

      {/* Black and White Layer */}
      <img
        src="https://api.builder.io/api/v1/image/assets/TEMP/1114dfef91ae0cbe7e11749b085c86e76b622cd1?width=2880"
        alt=""
        className="absolute inset-0 w-full h-full object-cover mix-blend-saturation"
      />

      {/* Dark Rectangle Overlay */}
      <img
        src="https://api.builder.io/api/v1/image/assets/TEMP/6116e231e2b4da3ca07b7050450de85c41db115b?width=2880"
        alt=""
        className="absolute inset-0 w-full h-full object-cover opacity-30 mix-blend-plus-darker"
      />

      {/* Radial Union Overlay */}
      <img
        src="https://api.builder.io/api/v1/image/assets/TEMP/55ba9df0b630378666075ae78b5f442e608b67bb?width=3075"
        alt=""
        className="absolute inset-0 w-full h-full object-cover"
        style={{
          fill: 'radial-gradient(55.11% 55.11% at 50% 47.84%, #BEFE46 0%, #000 100%)'
        }}
      />

      {/* Fade to page background */}
      <div
        className="absolute inset-0 w-full h-full"
        style={{
          background:
            "radial-gradient(60% 60% at 50% 45%, rgba(1, 1, 1, 0) 0%, rgba(1, 1, 1, 0.7) 60%, #010101 100%)",
        }}
      />

      {/* Decorative Elements */}
      {/* Small star top right */}
      <div className="absolute right-[213px] top-[175px] pointer-events-none">
        <svg width="41" height="41" viewBox="0 0 41 41" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M20.1391 0L22.1328 18.1454L40.2782 20.1391L22.1328 22.1328L20.1391 40.2782L18.1454 22.1328L0 20.1391L18.1454 18.1454L20.1391 0Z" fill="#BEFE46"/>
        </svg>
      </div>

      {/* Large star top left */}
      <div className="absolute left-[305px] top-[205px] pointer-events-none">
        <svg width="52" height="52" viewBox="0 0 52 52" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M25.9044 0L28.1024 23.7063L51.8087 25.9044L28.1024 28.1024L25.9044 51.8087L23.7063 28.1024L0 25.9044L23.7063 23.7063L25.9044 0Z" fill="#BEFE46"/>
        </svg>
      </div>

      {/* Small geometric shape 1 */}
      <div className="absolute left-[777px] bottom-[261px] pointer-events-none">
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path opacity="0.9" d="M11.8488 0V11.8488H0" stroke="#BEFE46" strokeWidth="1.606" strokeLinecap="round"/>
        </svg>
      </div>

      {/* Small geometric shape 2 */}
      <div className="absolute left-[674px] bottom-[364px] pointer-events-none">
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path opacity="0.9" d="M1.03586e-06 11.8488L0 1.03586e-06L11.8488 0" stroke="#BEFE46" strokeWidth="1.606" strokeLinecap="round"/>
        </svg>
      </div>

      {/* Horizontal line */}
      <div className="absolute left-[257px] top-[231px] w-[74px] h-[1px] bg-[#BEFE46] pointer-events-none" />

      {/* Content Container */}
      <div className="relative w-full h-full max-w-[1440px] mx-auto px-[113px] flex items-center justify-between">
        {/* Logo */}
        <div className="relative z-10">
          <svg width="474" height="166" viewBox="0 0 474 166" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g clipPath="url(#clip0_footer)">
              <path d="M39.8151 95.7246V105.733H9.95376V125.751H0V95.7246H39.8151Z" fill="#BEFE46"/>
              <path d="M49.7741 105.733H39.8203V125.751H49.7741V105.733Z" fill="#BEFE46"/>
              <path d="M228.939 115.742V125.751H218.986V155.777H209.032V125.751H199.078V115.742H209.032V95.7246H218.986V115.742H228.939Z" fill="#BEFE46"/>
              <path d="M238.892 155.776H218.984V165.785H238.892V155.776Z" fill="#BEFE46"/>
              <path d="M179.169 95.7246H169.215V165.786H179.169V95.7246Z" fill="#BEFE46"/>
              <path d="M79.6335 95.7246H69.6797V105.733H79.6335V95.7246Z" fill="#BEFE46"/>
              <path d="M139.353 95.7246H109.492V105.733H139.353V95.7246Z" fill="#BEFE46"/>
              <path d="M79.6335 115.741H69.6797V165.785H79.6335V115.741Z" fill="#BEFE46"/>
              <path d="M139.353 125.75H119.445V135.759H139.353V125.75Z" fill="#BEFE46"/>
              <path d="M149.305 135.759H139.352V155.776H149.305V135.759Z" fill="#BEFE46"/>
              <path d="M109.493 105.733H99.5391V155.777H109.493V105.733Z" fill="#BEFE46"/>
              <path d="M149.305 105.733H139.352V115.742H149.305V105.733Z" fill="#BEFE46"/>
              <path d="M139.353 155.776H109.492V165.785H139.353V155.776Z" fill="#BEFE46"/>
              <path d="M49.7741 135.759H39.8203V165.785H49.7741V135.759Z" fill="#BEFE46"/>
              <path d="M39.8183 125.75H9.95703V135.759H39.8183V125.75Z" fill="#BEFE46"/>
              <path d="M9.95376 135.759H0V165.785H9.95376V135.759Z" fill="#BEFE46"/>
            </g>
            <defs>
              <clipPath id="clip0_footer">
                <rect width="238.89" height="70.0611" fill="white" transform="translate(0 95.7246)"/>
              </clipPath>
            </defs>
          </svg>
        </div>

        {/* Navigation & Social */}
        <div className="relative z-10 flex flex-col justify-center items-start gap-8">
          <nav className="flex flex-col justify-center items-start gap-8">
            <Link href="/app" className="text-[#BEFE46] font-['IBM_Plex_Mono'] text-2xl font-normal hover:text-[#71A215] hover:underline transition-colors">
              DEMO
            </Link>
            <a href="#" className="text-[#BEFE46] font-['IBM_Plex_Mono'] text-2xl font-normal hover:text-[#71A215] hover:underline transition-colors">
              LITEPAPER
            </a>
            <a href="#" className="text-[#BEFE46] font-['IBM_Plex_Mono'] text-2xl font-normal hover:text-[#71A215] hover:underline transition-colors">
              DOCUMENTATION
            </a>
            <a href="#" className="text-[#BEFE46] font-['IBM_Plex_Mono'] text-2xl font-normal hover:text-[#71A215] hover:underline transition-colors">
              HISTORY
            </a>
          </nav>

          {/* Social Icons */}
          <div className="flex items-center gap-5">
            <a
              href="#"
              className="w-12 h-12 border-[0.5px] border-white flex items-center justify-center p-3 text-white hover:text-[#838383] hover:border-[#838383] transition-colors bg-transparent"
              aria-label="X (Twitter)"
            >
              <XIcon />
            </a>
            <a
              href="#"
              className="w-12 h-12 border-[0.5px] border-white flex items-center justify-center p-3 text-white hover:text-[#838383] hover:border-[#838383] transition-colors bg-transparent"
              aria-label="Telegram"
            >
              <TelegramIcon />
            </a>
            <a
              href="#"
              className="w-12 h-12 border-[0.5px] border-white flex items-center justify-center p-3 text-white hover:text-[#838383] hover:border-[#838383] transition-colors bg-transparent"
              aria-label="GitHub"
            >
              <GithubIcon />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
