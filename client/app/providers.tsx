import {AntdRegistry} from "@ant-design/nextjs-registry";
import {PropsWithChildren} from "react";

export default function Providers({ children }: PropsWithChildren) {

    return (
        <AntdRegistry>
            {children}
        </AntdRegistry>
    );
}
