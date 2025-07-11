import React, { useState, useRef, useEffect } from 'react';
import ReactDOM from 'react-dom';
import AddressBookIcon from '../icons/AddressBookIcon';
import './AddressBook.css';

export default function AddressBook({ addressList, onSelect, trigger }) {
  const [show, setShow] = useState(false);
  const [search, setSearch] = useState('');
  const [activeLetter, setActiveLetter] = useState('A');
  const [floatingLetter, setFloatingLetter] = useState(null); // 浮窗字母
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
  const listRef = useRef();
  const indexBarRef = useRef();
  const touchActive = useRef(false);

  const grouped = alphabet.map(letter => ({
    letter,
    contacts: addressList.filter(c => c.receiverName[0].toUpperCase() === letter && c.receiverName.toLowerCase().includes(search.toLowerCase())),
  }));

  // 滚动时自动高亮当前分组字母
  useEffect(() => {
    if (!show) return;
    const handleScroll = () => {
      if (!listRef.current) return;
      const containerTop = listRef.current.getBoundingClientRect().top;
      let current = 'A';
      for (const group of grouped) {
        const el = document.getElementById(`letter-${group.letter}`);
        if (el) {
          const offset = el.getBoundingClientRect().top - containerTop;
          if (offset <= 10) {
            current = group.letter;
          } else {
            break;
          }
        }
      }
      setActiveLetter(current);
    };
    const node = listRef.current;
    node && node.addEventListener('scroll', handleScroll);
    return () => node && node.removeEventListener('scroll', handleScroll);
  }, [show, grouped]);

  // 处理字母索引栏的滑动手势
  useEffect(() => {
    if (!show) return;
    const bar = indexBarRef.current;
    if (!bar) return;

    const getLetterByTouch = (clientY) => {
      const rect = bar.getBoundingClientRect();
      const itemHeight = rect.height / alphabet.length;
      let idx = Math.floor((clientY - rect.top) / itemHeight);
      idx = Math.max(0, Math.min(alphabet.length - 1, idx));
      return alphabet[idx];
    };

    const handleTouch = (e) => {
      e.preventDefault();
      touchActive.current = true;
      let clientY;
      if (e.touches && e.touches.length > 0) {
        clientY = e.touches[0].clientY;
      } else if (e.changedTouches && e.changedTouches.length > 0) {
        clientY = e.changedTouches[0].clientY;
      } else {
        return;
      }
      const letter = getLetterByTouch(clientY);
      setActiveLetter(letter);
      setFloatingLetter(letter);
      const el = document.getElementById(`letter-${letter}`);
      if (el) {
        el.scrollIntoView({ behavior: 'auto', block: 'start' });
      }
    };
    const handleTouchEnd = () => {
      touchActive.current = false;
      setTimeout(() => setFloatingLetter(null), 200);
    };
    bar.addEventListener('touchstart', handleTouch, { passive: false });
    bar.addEventListener('touchmove', handleTouch, { passive: false });
    bar.addEventListener('touchend', handleTouchEnd);
    // 桌面端鼠标支持
    bar.addEventListener('mousedown', handleTouch);
    bar.addEventListener('mousemove', (e) => { if (e.buttons === 1) handleTouch(e); });
    bar.addEventListener('mouseup', handleTouchEnd);
    return () => {
      bar.removeEventListener('touchstart', handleTouch);
      bar.removeEventListener('touchmove', handleTouch);
      bar.removeEventListener('touchend', handleTouchEnd);
      bar.removeEventListener('mousedown', handleTouch);
      bar.removeEventListener('mousemove', (e) => { if (e.buttons === 1) handleTouch(e); });
      bar.removeEventListener('mouseup', handleTouchEnd);
    };
  }, [show, alphabet]);

  // Portal弹窗内容
  const modal = show ? ReactDOM.createPortal(
    <div
      style={{
        position: 'fixed', left: 0, top: 0, width: '100vw', height: '100vh', zIndex: 99999,
        display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.3)'
      }}
      onClick={() => setShow(false)}
    >
      <div
        style={{
          background: '#fff', borderRadius: 16, width: '100%', maxWidth: 480, minWidth: 0,
          maxHeight: '80vh', width: '90vw', display: 'flex', flexDirection: 'row', overflow: 'hidden', boxShadow: '0 4px 32px rgba(0,0,0,0.12)'
        }}
        onClick={e => e.stopPropagation()}
      >
        <div ref={listRef} style={{ flex: 1, minWidth: 0, padding: '24px 16px 16px 16px', overflowY: 'auto', maxHeight: '80vh', minHeight: 0 }}>
          <input
            type="text"
            placeholder="搜索联系人"
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ width: '100%', marginBottom: 12, padding: '10px 14px', borderRadius: 8, border: '1px solid #ddd', boxSizing: 'border-box', background: '#fafbfc' }}
          />
          {grouped.length === 0 && (
            <div style={{ textAlign: 'center', color: '#bbb', padding: '32px 0' }}>暂无联系人</div>
          )}
          {grouped.map(group => (
            <div key={group.letter} id={`letter-${group.letter}`} style={{ marginBottom: 8 }}>
              <div style={{ fontWeight: 700, color: '#2563eb', fontSize: 12, marginBottom: 4 }}>{group.letter}</div>
              {group.contacts.length === 0 && <div style={{ fontSize: 12, color: '#ccc' }}>无</div>}
              {group.contacts.map(contact => (
                <div
                  key={contact.addressId}
                  style={{ padding: '4px 8px', borderRadius: 6, cursor: 'pointer', color: '#222', background: 'none', marginBottom: 2 }}
                  onClick={() => {
                    onSelect(contact);
                    setShow(false);
                  }}
                  onMouseOver={e => e.currentTarget.style.background = '#f0f6ff'}
                  onMouseOut={e => e.currentTarget.style.background = 'none'}
                >
                  {contact.receiverName}（{contact.city}）
                </div>
              ))}
            </div>
          ))}
        </div>
        {/* 字母索引栏可单独滚动 */}
        <div
          ref={indexBarRef}
          style={{ width: 40, flexShrink: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-start', background: '#f8fafc', borderLeft: '1px solid #eee', userSelect: 'none', touchAction: 'none', padding: '8px 0', cursor: 'pointer', maxHeight: '80vh', overflowY: 'auto' }}
        >
          {alphabet.map(letter => (
            <div
              key={letter}
              style={{ fontSize: 14, cursor: 'pointer', padding: '6px 0', margin: '2px 0', borderRadius: 8, width: 28, textAlign: 'center', fontWeight: activeLetter === letter ? 700 : 400, color: activeLetter === letter ? '#2563eb' : '#888', background: activeLetter === letter ? '#e0edff' : 'none' }}
              onClick={() => {
                setActiveLetter(letter);
                const el = document.getElementById(`letter-${letter}`);
                if (el) {
                  el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
              }}
            >
              {letter}
            </div>
          ))}
        </div>
        {/* 浮窗大号字母提示 */}
        {floatingLetter && (
          <div style={{ position: 'fixed', left: '50%', top: '50%', zIndex: 100000, transform: 'translate(-50%, -50%)', pointerEvents: 'none' }}>
            <div style={{ fontSize: 64, fontWeight: 'bold', color: '#2563eb', background: 'rgba(255,255,255,0.95)', borderRadius: 24, padding: '24px 36px', boxShadow: '0 2px 16px rgba(0,0,0,0.12)' }}>
              {floatingLetter}
            </div>
          </div>
        )}
      </div>
    </div>, document.body)
  : null;

  return (
    <>
      {trigger ? (
        React.cloneElement(trigger, { onClick: () => setShow(true) })
      ) : (
        <button type="button" onClick={() => setShow(true)} className="p-1 bg-white rounded-full border border-gray-200 hover:bg-gray-50">
          <AddressBookIcon className="h-5 w-5 text-blue-600" />
        </button>
      )}
      {modal}
    </>
  );
} 