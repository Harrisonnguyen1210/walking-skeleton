let countState = $state(0);

const useCountState = () => {
  if (import.meta.env.SSR) {
    countState = null;
  } else {
    countState = localStorage?.getItem("countState") || 0;
  }

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