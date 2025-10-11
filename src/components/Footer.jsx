import Link from 'next/link'
import React from 'react'

const Footer = () => {
  return (
    <footer className="w-full bg-[#FFF3F3] border-t border-[#ddd] py-3">
      <div className="container-global flex flex-wrap  justify-center items-center text-[0.7rem] lg:text-sm text-gray-700 gap-6 px-4">
        <Link href="/politique-de-confidentialite" className="hover:text-gray-900">
          Politique de confidentialité
        </Link>
        <Link href="/conditions-d-utilisation" className="hover:text-gray-900">
          Conditions d’utilisation
        </Link>
        <Link href="/aide-et-contact" className="hover:text-gray-900">
          Aide & Contact
        </Link>
        <span>© 2025 GarmentVision — Tous droits réservés.</span>
      </div>
    </footer>
  )
}

export default Footer
