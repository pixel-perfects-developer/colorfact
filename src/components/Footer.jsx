import Link from "next/link";
import React from "react";
import { Instagram, Linkedin, Facebook } from "lucide-react";

const Footer = () => {
  const iconClass =
  "size-4 lg:size-[1vw] 2xl:size-[1.2rem]";
  return (
    <footer className="w-full bg-[#F5F5F5] border-t border-[#E0E0E0] h-[12rem] lg:h-[8vh] flex flex-col justify-center items-center">
      <div className="container-global  flex flex-col lg:flex-row justify-between items-center gap-6 text-center lg:text-left animate-fadeInUp py-0 px-0">
        
        {/* 🔹 Left: Copyright */}
        <p className="text-[#666]">
          © 2025 ColorFact — Tous droits réservés.
        </p>

        {/* 🔹 Center: Footer Links */}
        <nav className="flex flex-wrap justify-center items-center gap-6  text-[0.8rem] lg:text-sm font-medium">
          <FooterLink
          //  href="/politique-de-confidentialite"
            href={"#"}

>
            Politique de confidentialité
          </FooterLink>
          <FooterLink 
          // href="/conditions-d-utilisation"
            href={"#"}
          >
            Conditions d’utilisation
          </FooterLink>
          <FooterLink
          //  href="/aide-et-contact"
            href={"#"}
          >Aide & Contact</FooterLink>
        </nav>

        {/* 🔹 Right: Social Icons (Lucide) */}
        <div className="flex justify-center items-center gap-4 text-[#333]">
          <SocialIcon href="#" label="Instagram">
            <Instagram className={iconClass}   />
          </SocialIcon>
          <SocialIcon href="#" label="LinkedIn">
            <Linkedin className={iconClass}  />
          </SocialIcon>
          <SocialIcon href="#" label="Facebook">
            <Facebook className={iconClass}  />
          </SocialIcon>
        </div>
      </div>
    </footer>
  );
};
// 
/* ✅ Reusable FooterLink Component (underline animation) */
const FooterLink = ({ href, children }) => (
  <Link
    href={href}
    className="relative group text-[#666] hover:text-[#333] transition-colors"
  >
    <p>{children}</p>
    <span className="absolute bottom-[-3px] left-0 w-0 h-[1px] bg-[#333] transition-all duration-300 group-hover:w-full"></span>
  </Link>
);

/* ✅ Reusable SocialIcon Component (hover lift) */
const SocialIcon = ({ href, label, children }) => (
  <Link
    href={href}
    aria-label={label}
    className="hover:text-black transition-all duration-300 transform hover:-translate-y-[2px]"
  >
     {children}
  </Link>
);

export default Footer;
