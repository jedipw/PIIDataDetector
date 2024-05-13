'use client';
import { signOut, useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";
import TextSelectionButton from "@/components/TextSelectionButton";
import PIIResponse from "./types/PIIResponse";

export default function Home() {
  const [fullName, setFullName] = useState('');
  const [showLogout, setShowLogout] = useState(false);
  const [isLogoutHovered, setIsLogoutHovered] = useState(false);
  const [isProfileHovered, setIsProfileHovered] = useState(false);
  const [isNewButtonHovered, setIsNewButtonHovered] = useState(false);
  const [isFullNameLoading, setIsFullNameLoading] = useState(true);
  const [textAreaValue, setTextAreaValue] = useState('');
  const [isFindingPII, setIsFindingPII] = useState(false);
  const [fullNames, setFullNames] = useState({});
  const [emails, setEmails] = useState({});
  const [idNums, setIdNums] = useState({});
  const [phoneNums, setPhoneNums] = useState({});
  const [streetAddresses, setStreetAddresses] = useState({});
  const [personalUrls, setPersonalUrls] = useState({});
  const [usernames, setUsernames] = useState({});

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

  const getPII = async () => {
    try {
      setIsFindingPII(true);
      const requestBody = { 'text': textAreaValue };
      const url = `${process.env.NEXT_PUBLIC_PII_URL}`;
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody)
      });
      const data = await response.json();
      console.log(typeof (data));
      setIsFindingPII(false);
      processPII(data);

      console.log('PII:', data);
    } catch (error) {
      console.error('Failed to fetch PII:', error);
    }
  }

  const processPII = (data: PIIResponse) => {
    let tempFullNames: {
      [key: string]: number;
    } = {};
    let tempEmails: {
      [key: string]: number;
    } = {};
    let tempIdNums: {
      [key: string]: number;
    } = {};
    let tempPhoneNums: {
      [key: string]: number;
    } = {};
    let tempStreetAddresses: {
      [key: string]: number;
    } = {};
    let tempPersonalUrls: {
      [key: string]: number;
    } = {};
    let tempUsernames: {
      [key: string]: number;
    } = {};
    let currentPII = '';
    let currentType = '';

    const tokens = data.data.tokens;
    const labels = data.prediction.label;
    const trailingWhitespace = data.data.trailing_whitespace;

    if (!tokens || !labels || !trailingWhitespace) return;

    Object.keys(labels).forEach((key: string) => {
      const tokenIndex = data.prediction.token[key];
      const label = labels[key];
      const token = tokens[tokenIndex];
      const space = trailingWhitespace[tokenIndex] ? ' ' : '';

      if (label.startsWith('B-')) {
        if (currentPII !== '') {
          let trimmedPII = currentPII.trim();
          switch (currentType) {
            case 'B-NAME_STUDENT': tempFullNames[trimmedPII] = (tempFullNames[trimmedPII] || 0) + 1; break;
            case 'B-EMAIL': tempEmails[trimmedPII] = (tempEmails[trimmedPII] || 0) + 1; break;
            case 'B-ID_NUM': tempIdNums[trimmedPII] = (tempIdNums[trimmedPII] || 0) + 1; break;
            case 'B-PHONE_NUM': tempPhoneNums[trimmedPII] = (tempPhoneNums[trimmedPII] || 0) + 1; break;
            case 'B-STREET_ADDRESS': tempStreetAddresses[trimmedPII] = (tempStreetAddresses[trimmedPII] || 0) + 1; break;
            case 'B-URL_PERSONAL': tempPersonalUrls[trimmedPII] = (tempPersonalUrls[trimmedPII] || 0) + 1; break;
            case 'B-USERNAME': tempUsernames[trimmedPII] = (tempUsernames[trimmedPII] || 0) + 1; break;
          }
        }
        currentPII = token + space;
        currentType = label;
      } else if (label.startsWith('I-')) {
        currentPII += token + space;
      }
    });

    if (currentPII !== '') {
      let trimmedPII = currentPII.trim();
      switch (currentType) {
        case 'B-NAME_STUDENT': tempFullNames[trimmedPII] = (tempFullNames[trimmedPII] || 0) + 1; break;
        case 'B-EMAIL': tempEmails[trimmedPII] = (tempEmails[trimmedPII] || 0) + 1; break;
        case 'B-ID_NUM': tempIdNums[trimmedPII] = (tempIdNums[trimmedPII] || 0) + 1; break;
        case 'B-PHONE_NUM': tempPhoneNums[trimmedPII] = (tempPhoneNums[trimmedPII] || 0) + 1; break;
        case 'B-STREET_ADDRESS': tempStreetAddresses[trimmedPII] = (tempStreetAddresses[trimmedPII] || 0) + 1; break;
        case 'B-URL_PERSONAL': tempPersonalUrls[trimmedPII] = (tempPersonalUrls[trimmedPII] || 0) + 1; break;
        case 'B-USERNAME': tempUsernames[trimmedPII] = (tempUsernames[trimmedPII] || 0) + 1; break;
      }
    }

    // Update state with the extracted information
    setFullNames(tempFullNames);
    setEmails(tempEmails);
    setIdNums(tempIdNums);
    setPhoneNums(tempPhoneNums);
    setStreetAddresses(tempStreetAddresses);
    setPersonalUrls(tempPersonalUrls);
    setUsernames(tempUsernames);

    console.log('Full names:', tempFullNames);
    console.log('Emails:', tempEmails);
    console.log('ID numbers:', tempIdNums);
    console.log('Phone numbers:', tempPhoneNums);
    console.log('Street addresses:', tempStreetAddresses);
    console.log('Personal URLs:', tempPersonalUrls);
    console.log('Usernames:', tempUsernames);
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
    if (!session.data?.user?.email) return;

    const fetchFullName = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/user/${session.data?.user?.email}`, { method: 'GET' });
        const data = await response.json();
        setFullName(`${data['firstName']} ${data['lastName']}`);
        console.log('Full name:', fullName)
      } catch (error) {
        console.error('Failed to fetch user full name:', error);
      }
    };

    fetchFullName().then(() => setIsFullNameLoading(false));
  }, [session.data?.user?.email, fullName]);

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
    isFullNameLoading ?
      <div className="h-screen flex flex-col justify-center items-center">
        <Image className="mb-4" width="100" height="100" src="/write.svg" alt="Write" style={{ filter: 'invert(100%)' }} />
        <div className="text-black font-extrabold text-3xl">Loading...</div>
      </div> : <div className="h-screen relative">
        <div className="absolute h-full overflow-auto left-80" style={{ width: `calc(100vw - 680px)` }}>
          <input
            className="w-full h-10 pr-10 mt-5 text-black text-xl font-bold"
            style={{
              lineHeight: 'normal',
              outline: 'none',
              height: '50px'
            }}
            placeholder="Untitled Document"
          />
          <textarea
            className="w-full pr-20 mt-10 pb-10 text-black text-xl resize-none font-extralight"
            value={textAreaValue}
            onChange={(event) => {
              setTextAreaValue(event.target.value);
            }}
            style={{
              lineHeight: 'normal',
              outline: 'none',
              height: 'calc(100vh - 150px)'
            }}
            placeholder="Type or paste your text here..."
          />
          <button
            disabled={!textAreaValue || isFindingPII}
            className="absolute w-40 h-16 flex items-center bottom-0 right-0 mb-5 mr-5 bg-[#FAD06D] hover:bg-[#E8A300] text-black font-bold py-2 px-4 rounded shadow-md disabled:opacity-40"
            onClick={() => getPII()}
          >
            <Image className="mr-2" width="30" height="30" src="/search.svg" alt="Search" style={{ filter: 'invert(100%)' }} />
            <p className="text-lg">Find PII</p>
          </button>
        </div>
        <div className="absolute shadow-2xl right-0 h-full p-5 bg-white overflow-auto" style={{ width: '350px', boxShadow: '-10px 0px 10px 1px rgba(0, 0, 0, 0.1)' }}>
          <div className="mt-5 p-4 rounded-xl" style={{ boxShadow: '10px 0 15px -3px rgba(0, 0, 0, 0.3)' }}>
            <div className="flex bg- pl-3 pt-1 pb-1 rounded-full bg-[#FAD06D]">
              <Image width="20" height="20" src="/name.svg" alt="Names" className="mr-2" style={{ filter: 'invert(100%)' }} />
              <p className="text-black font-bold text-md">Names</p>
            </div>
            <p className="pt-3 text-gray-400 italic">No names detected</p>
          </div>
          <div className="mt-5 p-4 rounded-xl" style={{ boxShadow: '10px 0 15px -3px rgba(0, 0, 0, 0.3)' }}>
            <div className="flex bg- pl-3 pt-1 pb-1 rounded-full bg-[#FAD06D]">
              <Image width="20" height="20" src="/email.svg" alt="Emails" className="mr-2" style={{ filter: 'invert(100%)' }} />
              <p className="text-black font-bold text-md">Emails</p>
            </div>
            <p className="pt-3 text-gray-400 italic">No emails detected</p>
          </div>
          <div className="mt-5 p-4 rounded-xl" style={{ boxShadow: '10px 0 15px -3px rgba(0, 0, 0, 0.3)' }}>
            <div className="flex bg- pl-3 pt-1 pb-1 rounded-full bg-[#FAD06D]">
              <Image width="20" height="20" src="/id_number.svg" alt="ID Numbers" className="mr-2" style={{ filter: 'invert(100%)' }} />
              <p className="text-black font-bold text-md">ID Numbers</p>
            </div>
            <p className="pt-3 text-gray-400 italic">No ID numbers detected</p>
          </div>
          <div className="mt-5 p-4 rounded-xl" style={{ boxShadow: '10px 0 15px -3px rgba(0, 0, 0, 0.3)' }}>
            <div className="flex bg- pl-3 pt-1 pb-1 rounded-full bg-[#FAD06D]">
              <Image width="20" height="20" src="/phone_number.svg" alt="Phone Numbers" className="mr-2" style={{ filter: 'invert(100%)' }} />
              <p className="text-black font-bold text-md">Phone Numbers</p>
            </div>
            <p className="pt-3 text-gray-400 italic">No phone numbers detected</p>
          </div>
          <div className="mt-5 p-4 rounded-xl" style={{ boxShadow: '10px 0 15px -3px rgba(0, 0, 0, 0.3)' }}>
            <div className="flex bg- pl-3 pt-1 pb-1 rounded-full bg-[#FAD06D]">
              <Image width="20" height="20" src="/address.svg" alt="Street Addresses" className="mr-2" style={{ filter: 'invert(100%)' }} />
              <p className="text-black font-bold text-md">Street Addresses</p>
            </div>
            <p className="pt-3 text-gray-400 italic">No street addresses detected</p>
          </div>
          <div className="mt-5 p-4 rounded-xl" style={{ boxShadow: '10px 0 15px -3px rgba(0, 0, 0, 0.3)' }}>
            <div className="flex bg- pl-3 pt-1 pb-1 rounded-full bg-[#FAD06D]">
              <Image width="20" height="20" src="/url.svg" alt="URLs" className="mr-2" style={{ filter: 'invert(100%)' }} />
              <p className="text-black font-bold text-md">URLs</p>
            </div>
            <p className="pt-3 text-gray-400 italic">No URLs detected</p>
          </div>
          <div className="mt-5 p-4 rounded-xl mb-5" style={{ boxShadow: '10px 0 15px -3px rgba(0, 0, 0, 0.3)' }}>
            <div className="flex bg- pl-3 pt-1 pb-1 rounded-full bg-[#FAD06D]">
              <Image width="20" height="20" src="/username.svg" alt="Usernames" className="mr-2" style={{ filter: 'invert(100%)' }} />
              <p className="text-black font-bold text-md">Usernames</p>
            </div>
            <p className="pt-3 text-gray-400 italic">No usernames detected</p>
          </div>
        </div>
        <div className="h-full bg-white p-3 overflow-auto" style={{ width: '275px', height: 'calc(100vh - 80px)', boxShadow: '10px 0 15px -3px rgba(0, 0, 0, 0.1)' }}>
          <button
            className="flex pl-2 pr-2 pt-3 pb-3 mb-5 w-full rounded-xl items-center justify-between"
            onMouseEnter={() => setIsNewButtonHovered(true)}
            onMouseLeave={() => setIsNewButtonHovered(false)}
            style=
            {{
              backgroundColor: isNewButtonHovered ? '#EBEBEB' : ''
            }}
          >
            <div className="flex items-center">
              <div className='w-8 h-8 rounded-full flex items-center justify-center mr-3 bg-[#FAD06D]'>
                <Image width="25" height="25" src="/write.svg" alt="Write" style={{ filter: 'invert(100%)' }} />
              </div>
              <p className="text-black font-bold">New Document</p>
            </div>
            <Image width="20" height="20" src="/new.svg" alt="Log out" style={{ filter: 'invert(100%)' }} />
          </button>
          <TextSelectionButton />
          <TextSelectionButton />
          <TextSelectionButton />
          <TextSelectionButton />
          <TextSelectionButton />
          <TextSelectionButton />
          <TextSelectionButton />
          <TextSelectionButton />
          <TextSelectionButton />
          {showLogout && (
            <div className="absolute flex bg-white bottom-20 p-3 rounded-xl shadow-xl items-center z-10" style={{ width: '240px', height: '60px' }}>
              <button
                className="text-black font-bold items-center flex rounded-xl p-3"
                onClick={signOutAndSetShowLogOut}
                onMouseEnter={() => setIsLogoutHovered(true)}
                onMouseLeave={() => setIsLogoutHovered(false)}
                style={{
                  width: '230px',
                  height: '40px',
                  backgroundColor: isLogoutHovered ? '#EBEBEB' : '',
                }}
              >
                <Image width="20" height="20" src="/logout.svg" alt="Log out" className="mr-2" style={{ filter: 'invert(100%)' }} /> Log out
              </button>
            </div>
          )}
          <div className="absolute flex items-center bottom-0 left-0 p-3 bg-white" style={{ width: '275px', boxShadow: '10px 0 15px -3px rgba(0, 0, 0, 0.1)' }}>
            <button
              className="flex items-center p-2 rounded-xl"
              onClick={(e) => handleUserClick(e)}
              onMouseEnter={() => setIsProfileHovered(true)}
              onMouseLeave={() => setIsProfileHovered(false)}
              style=
              {{
                width: '250px',
                height: '60px',
                backgroundColor: showLogout || isProfileHovered ? '#EBEBEB' : ''
              }}
            >
              <div className="flex items-center">
                <div
                  className='w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center mr-3'
                  style={{ backgroundColor: hashStringToColor(fullName) }}
                >
                  <span
                    className='text-black font-semibold'
                    style={{ color: isColorDark(hashStringToColor(fullName)) ? 'white' : 'black' }}
                  >
                    {getInitials(fullName)}
                  </span>
                </div>
                <div className='text-black font-bold text-md'>{
                  fullName}
                </div>
              </div>
            </button>
          </div>
        </div>
      </div>
  );
}

Home.requireAuth = true;