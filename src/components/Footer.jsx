import Link from "next/link";
import React from "react";
import { Instagram, Linkedin, Facebook } from "lucide-react";

const Footer = () => {
  return (
    <footer className="w-full bg-[#F5F5F5] border-t border-[#E0E0E0] py-[3%] lg:py-[1.5%]">
      <div className="container-global  flex flex-col lg:flex-row justify-between items-center gap-6 text-center lg:text-left animate-fadeInUp py-0 px-0">
        
        {/* 🔹 Left: Copyright */}
        <span className="text-[#666] text-[0.8rem] lg:text-sm">
          © 2025 ColorFact — Tous droits réservés.
        </span>

        {/* 🔹 Center: Footer Links */}
        <nav className="flex flex-wrap justify-center items-center gap-6 text-[#666] text-[0.8rem] lg:text-sm font-medium">
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
            <Instagram size={18} strokeWidth={1.8} />
          </SocialIcon>
          <SocialIcon href="#" label="LinkedIn">
            <Linkedin size={18} strokeWidth={1.8} />
          </SocialIcon>
          <SocialIcon href="#" label="Facebook">
            <Facebook size={18} strokeWidth={1.8} />
          </SocialIcon>
        </div>
      </div>
    </footer>
  );
};

/* ✅ Reusable FooterLink Component (underline animation) */
const FooterLink = ({ href, children }) => (
  <Link
    href={href}
    className="relative group text-[#666] hover:text-[#333] transition-colors"
  >
    {children}
    <span className="absolute bottom-[-3px] left-0 w-0 h-[1px] bg-[#333] transition-all duration-300 group-hover:w-full"></span>
  </Link>
);

/* ✅ Reusable SocialIcon Component (hover lift) */
const SocialIcon = ({ href, label, children }) => (
  <a
    href={href}
    aria-label={label}
    className="hover:text-black transition-all duration-300 transform hover:-translate-y-[2px]"
  >
    {children}
  </a>
);

export default Footer;
