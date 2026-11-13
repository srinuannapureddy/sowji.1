
import React from 'react';
import {
  Routes,
  Route,
  Link,
  useLocation
} from 'react-router-dom';

import Header from './Header.jsx';
import Footer from './Footer.jsx';
import WhatsAppButton from './WhatsAppButton.jsx';

import Home from './Home.jsx';
import Shop from './Shop.jsx';
import Collections from './Collections.jsx';
import About from './About.jsx';
import Contact from './Contact.jsx';

import Cart from './Cart.jsx';
import Wishlist from './Wishlist.jsx';
import ProductDetails from './ProductDetails.jsx';
import Account from './Account.jsx';
import Admin from './Admin.jsx';

function ScrollToTop() {
  const { pathname, search } = useLocation();

  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname, search]);

  return null;
}

const pageContent = {
  '/support': {
    eyebrow: 'WE ARE HERE TO HELP',
    title: 'Customer Support',
    intro: 'We are happy to help you with your Sowji Collections shopping experience.',
    sections: [
      {
        title: 'Order assistance',
        text: 'Need help with an order, payment, delivery or product? Please contact our team with your order details.'
      },
      {
        title: 'Product enquiries',
        text: 'Have questions about a saree, its fabric, colour, weave or availability? Get in touch with us before placing your order.'
      },
      {
        title: 'Get in touch',
        text: 'You can reach us through our Contact Us page or WhatsApp.'
      }
    ]
  },

  '/faq': {
    eyebrow: 'A LITTLE HELP',
    title: 'Frequently Asked Questions',
    intro: 'Find answers to some common questions about shopping with Sowji Collections.',
    faqs: [
      {
        q: 'How can I place an order?',
        a: 'Browse our saree collections, open the product you like, choose the available options and follow the checkout process.'
      },
      {
        q: 'How can I check my order status?',
        a: 'Sign in to your account and check your available order information. You can also contact our support team for assistance.'
      },
      {
        q: 'Are the product photographs of actual sarees?',
        a: 'Please refer to the photographs and product descriptions displayed on each product page. Contact us if you need additional details.'
      },
      {
        q: 'How can I ask about a saree?',
        a: 'Use our Contact Us page or WhatsApp to ask about product details and availability.'
      },
      {
        q: 'Where can I find delivery and return information?',
        a: 'Please read our Shipping Policy and Returns & Refunds pages for further information.'
      },
      {
        q: 'How can I contact Sowji Collections?',
        a: 'Visit our Contact Us page or use the WhatsApp link on our website.'
      }
    ]
  },

  '/shipping-policy': {
    eyebrow: 'DELIVERY INFORMATION',
    title: 'Shipping Policy',
    intro: 'We want your saree shopping experience to be smooth from checkout to delivery.',
    sections: [
      {
        title: 'Order processing',
        text: 'Orders are processed after successful order confirmation and payment verification, where applicable.'
      },
      {
        title: 'Shipping charges',
        text: 'Applicable shipping charges, if any, are displayed during checkout before you confirm your order.'
      },
      {
        title: 'Delivery timelines',
        text: 'Estimated delivery information may vary depending on your delivery location and order circumstances. Please refer to the information provided during checkout.'
      },
      {
        title: 'Delivery assistance',
        text: 'If you have questions about your shipment, contact our support team with your order details.'
      }
    ]
  },

  '/return-policy': {
    eyebrow: 'SHOP WITH CONFIDENCE',
    title: 'Returns & Refunds',
    intro: 'We want you to feel confident when shopping with Sowji Collections.',
    sections: [
      {
        title: 'Before requesting a return',
        text: 'Please check the product description, photographs and details carefully before placing your order.'
      },
      {
        title: 'Return requests',
        text: 'If you receive a damaged, incorrect or otherwise problematic item, contact our team with your order details and clear photographs of the issue.'
      },
      {
        title: 'Product condition',
        text: 'Please keep the product, original packaging and any included tags or accessories in their received condition while your request is being reviewed.'
      },
      {
        title: 'Refunds',
        text: 'Refund eligibility and processing will be reviewed based on the order and the applicable return conditions. Any approved refund will be handled through the applicable payment process.'
      },
      {
        title: 'Contact us',
        text: 'Please contact our team before sending any item back so that we can guide you through the process.'
      }
    ]
  },

  '/privacy-policy': {
    eyebrow: 'YOUR PRIVACY MATTERS',
    title: 'Privacy Policy',
    intro: 'Sowji Collections respects your privacy and aims to handle your personal information responsibly.',
    sections: [
      {
        title: 'Information we collect',
        text: 'Information you provide while creating an account, placing an order or contacting us may include your name, email address, phone number, delivery address and order details.'
      },
      {
        title: 'How information is used',
        text: 'Information may be used to process orders, provide customer support, manage accounts and improve your shopping experience.'
      },
      {
        title: 'Payments',
        text: 'Payments may be processed through third-party payment providers. Payment handling is subject to the provider’s applicable security and privacy practices.'
      },
      {
        title: 'Information security',
        text: 'We take reasonable steps to protect information handled through our website. No method of online transmission or storage can be guaranteed to be completely secure.'
      },
      {
        title: 'Questions about privacy',
        text: 'For privacy-related questions or requests, please contact us through our Contact Us page.'
      }
    ]
  },

  '/terms': {
    eyebrow: 'PLEASE READ',
    title: 'Terms & Conditions',
    intro: 'These terms apply to your use of the Sowji Collections website and shopping services.',
    sections: [
      {
        title: 'Website use',
        text: 'Please use this website lawfully and provide accurate information when creating an account or placing an order.'
      },
      {
        title: 'Product information',
        text: 'We make reasonable efforts to display accurate product descriptions, photographs, colours and prices. Actual colours may appear slightly different depending on your screen and display settings.'
      },
      {
        title: 'Orders and payments',
        text: 'Orders are subject to availability, order confirmation and successful payment where applicable. The information shown during checkout applies to your order.'
      },
      {
        title: 'Intellectual property',
        text: 'Website content, branding, photographs, designs and other materials may not be copied or reused without appropriate permission.'
      },
      {
        title: 'Changes to these terms',
        text: 'We may update these terms when necessary. Please review this page periodically for the latest information.'
      },
      {
        title: 'Contact',
        text: 'If you have questions about these terms, please contact us through our Contact Us page.'
      }
    ]
  }
};

function InformationPage() {
  const { pathname } = useLocation();
  const page = pageContent[pathname];

  if (!page) {
    return <NotFound />;
  }

  return (
    <section className="min-h-[65vh] bg-[#fbf8f2] px-5 py-16 md:py-24">
      <div className="mx-auto max-w-4xl">
        <div className="mb-12 text-center">
          <p className="text-[10px] font-semibold uppercase tracking-[4px] text-[#a17b50]">
            {page.eyebrow}
          </p>

          <h1 className="mt-5 font-display text-4xl text-[#681f32] md:text-6xl">
            {page.title}
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-sm leading-7 text-[#81776e] md:text-base">
            {page.intro}
          </p>

          <div className="mx-auto mt-8 h-px w-20 bg-[#c6a46b]" />
        </div>

        {page.sections && (
          <div className="space-y-8">
            {page.sections.map((section, index) => (
              <article
                key={section.title}
                className="border-b border-[#e8dfd2] pb-7"
              >
                <h2 className="font-display text-2xl text-[#681f32]">
                  {section.title}
                </h2>

                <p className="mt-3 text-sm leading-7 text-[#766d65]">
                  {section.text}
                </p>
              </article>
            ))}
          </div>
        )}

        {page.faqs && (
          <div className="space-y-4">
            {page.faqs.map((faq) => (
              <details
                key={faq.q}
                className="group border border-[#e8dfd2] bg-white/60 px-5 py-5"
              >
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-medium text-[#681f32]">
                  <span>{faq.q}</span>
                  <span className="text-xl text-[#a17b50] group-open:rotate-45">
                    +
                  </span>
                </summary>

                <p className="mt-4 text-sm leading-7 text-[#766d65]">
                  {faq.a}
                </p>
              </details>
            ))}
          </div>
        )}

        {pathname === '/support' && (
          <div className="mt-12 grid gap-5 md:grid-cols-3">
            {page.sections.map((section) => (
              <div
                key={section.title}
                className="border border-[#e8dfd2] bg-white/60 p-6"
              >
                <h2 className="font-display text-xl text-[#681f32]">
                  {section.title}
                </h2>
                <p className="mt-3 text-sm leading-7 text-[#766d65]">
                  {section.text}
                </p>
              </div>
            ))}
          </div>
        )}

        <div className="mt-14 flex flex-wrap justify-center gap-4">
          <Link
            to="/contact"
            className="bg-[#681f32] px-8 py-3 text-xs uppercase tracking-widest text-white transition hover:bg-[#4e1727]"
          >
            Contact Us
          </Link>

          <Link
            to="/"
            className="border border-[#c6a46b] px-8 py-3 text-xs uppercase tracking-widest text-[#681f32] transition hover:bg-[#f2eadf]"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </section>
  );
}

function NotFound() {
  return (
    <section className="flex min-h-[60vh] items-center justify-center bg-[#fbf8f2] px-5 py-20 text-center">
      <div>
        <h1 className="font-display text-5xl text-[#681f32]">
          404
        </h1>

        <p className="mt-4 text-[#81776e]">
          This page could not be found.
        </p>

        <Link
          to="/"
          className="mt-6 inline-block bg-[#681f32] px-8 py-3 text-xs uppercase tracking-widest text-white"
        >
          Back to Home
        </Link>
      </div>
    </section>
  );
}

export default function App() {
  const location = useLocation();
  const isAdminPage = location.pathname.startsWith('/admin');

  return (
    <>
      <ScrollToTop />

      {isAdminPage ? (
        <Routes>
          <Route path="/admin" element={<Admin />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      ) : (
        <div className="flex min-h-screen flex-col bg-[#fbf8f2]">
          <Header />

          <main className="flex-1">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/shop" element={<Shop />} />
              <Route path="/category/:slug" element={<Shop />} />
              <Route path="/product/:slug" element={<ProductDetails />} />
              <Route path="/collections" element={<Collections />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />

              <Route path="/support" element={<InformationPage />} />
              <Route path="/faq" element={<InformationPage />} />
              <Route path="/shipping-policy" element={<InformationPage />} />
              <Route path="/return-policy" element={<InformationPage />} />
              <Route path="/privacy-policy" element={<InformationPage />} />
              <Route path="/terms" element={<InformationPage />} />

              <Route path="/cart" element={<Cart />} />
              <Route path="/wishlist" element={<Wishlist />} />
              <Route path="/account" element={<Account />} />

              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>

          <Footer />
          <WhatsAppButton />
        </div>
      )}
    </>
  );
}
