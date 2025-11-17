"use client";

import Error500Page from "@/components/pages/Error500Page";

type Props = {
    error: Error;
    reset: () => void;
};

export default function Error({ error, reset }: Props) {
    return <Error500Page error={error} reset={reset} />;
}
