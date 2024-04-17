//TODO：採用担当者様用の検索ページで使用
<div className="relative py-2 px-2 bg-grey-lightest">
  <input
    type="search"
    className="w-full border-2 border-gray-300 bg-white h-10 px-5 pr-16 rounded-lg text-sm focus:outline-none"
    placeholder="検索"
    // onChange={handleSearchChange}
    name="username"
  />
  <button
    type="submit"
    className="absolute inset-y-0 right-0 mr-6 flex items-center"
  >
    <svg
      className="text-gray-600 h-4 w-4 fill-current"
      xmlns="http://www.w3.org/1999/xlink"
      viewBox="0 0 56.966 56.966"
      width="16px"
      height="16px"
      // onClick={searchUser}
    >
      <path d="M55.146,51.887L41.588,37.786c3.486-4.144,5.396-9.358,5.396-14.786c0-12.682-10.318-23-23-23s-23,10.318-23,23  s10.318,23,23,23c4.761,0,9.298-1.436,13.177-4.162l13.661,14.208c0.571,0.593,1.339,0.92,2.162,0.92  c0.779,0,1.518-0.297,2.079-0.837C56.255,54.982,56.293,53.08,55.146,51.887z M23.984,6c9.374,0,17,7.626,17,17s-7.626,17-17,17  s-17-7.626-17-17S14.61,6,23.984,6z" />
    </svg>
  </button>
</div> 