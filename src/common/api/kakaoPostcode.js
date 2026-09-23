let loading;

export function loadKakaoPostcode() {
  if (window.daum?.Postcode) return Promise.resolve(window.daum.Postcode);
  if (loading) return loading;
  loading = new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = 'https://t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js';
    script.onload = () => window.daum?.Postcode ? resolve(window.daum.Postcode) : reject(new Error('주소검색을 불러오지 못했습니다.'));
    script.onerror = () => reject(new Error('주소검색을 불러오지 못했습니다. 우편번호와 주소를 직접 입력해 주세요.'));
    document.head.appendChild(script);
  }).catch((error) => { loading = null; throw error; });
  return loading;
}

export async function openKakaoPostcode(onComplete) {
  const Postcode = await loadKakaoPostcode();
  new Postcode({ oncomplete: onComplete }).open();
}
