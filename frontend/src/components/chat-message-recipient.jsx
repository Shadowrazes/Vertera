import "../css/chat-message-recipient.css";

function ChatMessage({ message, sender, time, attachs }) {
  let isVisible;
  const isBuild = import.meta.env.DEV !== "build";

  if (attachs.length == 0) {
    isVisible = true;
  } else {
    isVisible = false;
  }

  const getFullName = (userData) => {
    let result = "";
    console.log(userData);
    if(userData?.name) {
        result += userData?.name + " ";
    }
    if(userData?.surname) {
        result += userData?.surname + " ";
    }
    if(userData?.patronymic) {
        result += userData?.patronymic;
    }
    return result;
  }

  return (
    <>
      <div className="chat-message-recipient__container">
        <div className="chat-message-recipient__box">
          <h3 className="chat-message-recipient__name">{getFullName(sender)}</h3>
          <div className="chat-message-recipient__text">{message}</div>
          {!isVisible && (
            <>
              <span className="chat-message-recipient__attachs-title">
                Прикрепленные файлы:
              </span>
              <div className="chat-message-recipient__attachs">
                {attachs &&
                  attachs.map((attach) => (
                    <div key={attach.id}>
                      
                      <a
                        className="chat-message-recipient__attach-link"
                        download
                        target="_blank"
                        rel="noopener noreferrer"
                        href={
                          isBuild
                            ? "https://vticket.yasanyabeats.ru:4444" +
                              attach.path
                            : "http://localhost:4444" + attach.path
                        }
                      >
                        <img src="/file.svg" className="chat-message-recipient__attach-icon" alt="" />
                        <span className="chat-message-recipient__attach">
                          {attach.name}
                        </span>
                      </a>
                    </div>
                  ))}
              </div>
            </>
          )}
          {/* <div className="chat-message-recepient__separator"></div>
          <div className="chat-message-recepient__rate-container">
            <span className="chat-message-recepient__rate-title">
              Оцените ответ
            </span>
            <div className="chat-message-recepient__rate-like">
              <a href="#">
                <span className="chat-message-recepient__rate-icon-dislike">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="22"
                    height="21"
                    viewBox="0 0 22 21"
                    fill="none"
                  >
                    <path
                      d="M8.02258 3.96863V9.38062"
                      stroke="black"
                      stroke-width="1.46799"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                    <path
                      d="M8.02258 9.38074L10.7139 18.3453C10.797 18.6426 10.9747 18.9048 11.2201 19.092C11.4657 19.2792 11.7655 19.3813 12.0742 19.3826C12.2618 19.3814 12.4474 19.3432 12.6203 19.2702C12.7931 19.1972 12.9499 19.0908 13.0818 18.9572C13.2135 18.8236 13.3177 18.6654 13.3883 18.4916C13.4589 18.3177 13.4945 18.1317 13.4933 17.944V12.7767"
                      stroke="black"
                      stroke-width="1.46799"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                    <path
                      d="M1.49598 10.5747C1.47168 11.0183 1.53808 11.4624 1.69114 11.8795C1.84418 12.2966 2.08066 12.6781 2.38612 13.0007C2.69158 13.3234 3.05961 13.5804 3.46773 13.756C3.87586 13.9316 4.3155 14.0222 4.75981 14.0222C5.20412 14.0222 5.64376 13.9316 6.05189 13.756C6.46001 13.5804 6.82807 13.3234 7.13353 13.0007C7.43899 12.6781 7.67547 12.2966 7.82852 11.8795C7.98157 11.4624 8.04797 11.0183 8.02367 10.5747V5.06485C8.04797 4.6212 7.98157 4.17728 7.82852 3.76017C7.67547 3.34304 7.43899 2.96145 7.13353 2.6388C6.82807 2.31614 6.46001 2.05916 6.05189 1.88353C5.64376 1.7079 5.20412 1.61731 4.75981 1.61731C4.3155 1.61731 3.87586 1.7079 3.46773 1.88353C3.05961 2.05916 2.69158 2.31614 2.38612 2.6388C2.08066 2.96145 1.84418 3.34304 1.69114 3.76017C1.53808 4.17728 1.47168 4.6212 1.49598 5.06485V10.5747Z"
                      stroke="black"
                      stroke-width="1.46799"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                    <path
                      d="M8.02264 5.06481C8.02007 4.63426 8.10229 4.20744 8.26468 3.80869C8.42706 3.40993 8.66639 3.04705 8.96902 2.74078C9.27164 2.43453 9.63158 2.19088 10.0284 2.02375C10.4252 1.85662 10.851 1.76929 11.2816 1.76672H15.3137C16.2538 1.76743 17.1684 2.07307 17.9201 2.63774C18.6719 3.20242 19.2202 3.99567 19.4828 4.89845L20.9508 9.87003C21.0676 10.2005 21.1039 10.5541 21.0566 10.9014C21.0092 11.2487 20.8797 11.5798 20.6787 11.8669C20.4777 12.154 20.211 12.3891 19.9009 12.5524C19.5907 12.7158 19.246 12.8027 18.8956 12.806H13.5129"
                      stroke="black"
                      stroke-width="1.46799"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                  </svg>
                </span>
              </a>
              <a href="#">
                <span className="chat-message-recepient__rate-icon-like">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="22"
                    height="21"
                    viewBox="0 0 22 21"
                    fill="none"
                  >
                    <path
                      d="M7.46448 17.0459V11.6339"
                      stroke="black"
                      stroke-width="1.46799"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                    <path
                      d="M0.918711 10.44C0.894411 9.99642 0.960813 9.5525 1.11387 9.13539C1.26691 8.71819 1.50337 8.33671 1.80883 8.01404C2.1143 7.69139 2.48234 7.43435 2.89046 7.25872C3.29859 7.08309 3.73824 6.99255 4.18255 6.99255C4.62687 6.99255 5.06651 7.08309 5.47463 7.25872C5.88276 7.43435 6.2508 7.69139 6.55626 8.01404C6.86172 8.33671 7.0982 8.71819 7.25125 9.13539C7.40429 9.5525 7.47068 9.99642 7.44638 10.44V15.9499C7.47068 16.3935 7.40429 16.8375 7.25125 17.2547C7.0982 17.6718 6.86172 18.0532 6.55626 18.3759C6.2508 18.6986 5.88276 18.9556 5.47463 19.1312C5.06651 19.3068 4.62687 19.3974 4.18255 19.3974C3.73824 19.3974 3.29859 19.3068 2.89046 19.1312C2.48234 18.9556 2.1143 18.6986 1.80883 18.3759C1.50337 18.0532 1.26691 17.6718 1.11387 17.2547C0.960813 16.8375 0.894411 16.3935 0.918711 15.9499V10.44Z"
                      stroke="black"
                      stroke-width="1.46799"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                    <path
                      d="M7.46454 15.9498C7.46196 16.3803 7.54421 16.8071 7.70659 17.2059C7.86898 17.6046 8.10831 17.9675 8.41093 18.2738C8.71354 18.5801 9.07349 18.8237 9.47034 18.9908C9.86709 19.158 10.2929 19.2454 10.7235 19.2479H14.7556C15.6957 19.2472 16.6104 18.9416 17.3621 18.3769C18.1138 17.8122 18.6621 17.0189 18.9247 16.1162L20.3927 11.1446C20.5095 10.8141 20.5457 10.4605 20.4985 10.1132C20.4511 9.76585 20.3215 9.43487 20.1206 9.14773C19.9196 8.86059 19.6529 8.62552 19.3428 8.46218C19.0326 8.29884 18.688 8.21194 18.3375 8.20861H12.9353V3.04127C12.9366 2.85362 12.9008 2.66761 12.8303 2.49376C12.7596 2.31991 12.6555 2.16167 12.5237 2.02808C12.3919 1.89449 12.2352 1.78814 12.0622 1.71514C11.8894 1.64215 11.7038 1.60394 11.5162 1.60266C11.2075 1.60406 10.9076 1.70612 10.6622 1.89332C10.4166 2.08053 10.2389 2.34268 10.1559 2.64004L7.46454 11.6046"
                      stroke="black"
                      stroke-width="1.46799"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                  </svg>
                </span>
              </a>
            </div>
          </div> */}
        </div>
        <span className="chat-message-recipient__time">{time}</span>
      </div>
    </>
  );
}

export default ChatMessage;
