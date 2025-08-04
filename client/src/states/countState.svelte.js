let countState = $state(Number(localStorage?.getItem("countState")) || 0);

const useCountState = () => {
  return {
    get count() {
      return countState;
    },
    increment: () => {
      countState++;
      localStorage.setItem("countState", countState);
    },
  };
};

export { useCountState };
