'use client';

type FooterProps = {
  transparent?: boolean;
};

export default function Footer({ transparent }: FooterProps) {
  return (
    <footer
      className={`py-6 text-center text-sm ${
        transparent ? '' : 'bg-white border-t'
      }`}
    >
      <p className='text-gray-500'>
        © {new Date().getFullYear()}{' '}
        <span className='font-semibold text-sky-500'>ErgoCheck</span>. All rights reserved.
      </p>
    </footer>
  );
}
