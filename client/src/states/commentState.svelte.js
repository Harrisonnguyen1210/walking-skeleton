let comments = $state([]);

const useCommentState = () => {
    if (import.meta.env.SSR) {
        comments = null;
    } else {
        comments = JSON.parse(localStorage?.getItem("comments")) || [];
    }

    return {
        get count() {
            if (!comments) return 0;
            return comments.length;
        },
        get comments() {
            return comments;
        },
        add: (comment) => {
            comments.push(comment);
            localStorage.setItem("comments", JSON.stringify(comments));
        },
    };
};

export { useCommentState };
