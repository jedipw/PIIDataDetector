'use client';
import { signOut, useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { useEffect, useState } from "react";
import { auth } from "./firebase";
import { onAuthStateChanged } from "firebase/auth";
import Image from "next/image";

export default function Home() {
  const [fullName, setFullName] = useState('');
  const [userId, setUserId] = useState('');
  const [showLogout, setShowLogout] = useState(false);
  const [isLogoutHovered, setIsLogoutHovered] = useState(false);
  
  const session = useSession({
    required: true,
    onUnauthenticated() {
      redirect('/signin');
    },
  });

  const handleUserClick = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    event.stopPropagation();
    setShowLogout(!showLogout); // Toggle visibility of logout option
  };

  const signOutAndSetShowLogOut = () => {
    setShowLogout(false);
    signOut()
  };

  useEffect(() => {
    // Step 2: Define a function to handle the click and set showLogout to false
    const handleWindowClick = () => {
      setShowLogout(false);
    };

    // Add the event listener to the window object
    window.addEventListener('click', handleWindowClick);

    // Step 4: Return a cleanup function to remove the event listener
    return () => {
      window.removeEventListener('click', handleWindowClick);
    };
  }, []);

  useEffect(() => {
    // Step 2: Set up Firebase Auth observer
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserId(user.uid); // Step 3: Update userId state
      } else {
        setUserId('');
      }
    });

    return () => unsubscribe(); // Clean up the observer
  }, []);

  useEffect(() => {
    if (!userId) return;

    const fetchFullName = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/user/${userId}`, { method: 'GET' });
        const data = await response.json();
        setFullName(`${data['firstName']} ${data['lastName']}`);
      } catch (error) {
        console.error('Failed to fetch user full name:', error);
      }
    };

    fetchFullName();
  }, [userId]);

  const getInitials = (name: string) => {
    const names = name.split(' ');
    if (names.length > 1) {
      return `${names[0][0]}${names[names.length - 1][0]}`;
    }
    return names[0][0];
  };

  const hashStringToColor = (str: string) => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    let color = '#';
    for (let i = 0; i < 3; i++) {
      const value = (hash >> (i * 8)) & 0xFF;
      color += ('00' + value.toString(16)).substr(-2);
    }
    return color;
  };

  const isColorDark = (color: string) => {
    const hex = color.replace('#', '');
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);
    // Using the luminance formula to calculate brightness
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    return luminance < 0.5;
  };

  return (
    <div className="h-screen relative">
      <div className="shadow-2xl" style={{ width: '275px', height: '100%' }}>
        {showLogout && (
          <div className="absolute ml-4 flex bg-white bottom-20 p-2 rounded-xl shadow-xl items-center" style={{ width: '240px', height: '60px' }}>
            <button
              className="text-black font-bold items-center flex rounded-xl p-3"
              onClick={signOutAndSetShowLogOut}
              onMouseEnter={() => setIsLogoutHovered(true)}
              onMouseLeave={() => setIsLogoutHovered(false)}
              style={{
                width: '230px',
                height: '50px',
                backgroundColor: isLogoutHovered ? '#F4EEE0' : '',
              }}
            >
              <Image width="20" height="20" src="/logout.svg" alt="Log out" className="mr-2" style={{filter: 'invert(100%)'}}/> Log out
            </button>
          </div>
        )}
        <div className="absolute flex items-center bottom-0 left-0 p-3">
          {/* Button wrapping the circle and name */}

          <button className="flex items-center p-2 rounded-xl" onClick={(e) => handleUserClick(e)} style={{ width: '250px', height: '60px', backgroundColor: showLogout ? '#FAD06D' : '' }}>
            <div className='w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center mr-3' style={{ backgroundColor: hashStringToColor(fullName) }}>
              <span className='text-black font-semibold' style={{ color: isColorDark(hashStringToColor(fullName)) ? 'white' : 'black' }}>{getInitials(fullName)}</span>
            </div>
            <div className='text-black font-bold text-sm'>{fullName}</div>
          </button>
          {/* Logout option */}

        </div>
      </div>

    </div>
  );
}

Home.requireAuth = true;