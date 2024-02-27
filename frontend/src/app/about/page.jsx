import Image from 'next/image';
import styles from './about.module.css';
import Link from 'next/link';
import { Github, Star, Code2 } from 'lucide-react';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { docco } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import CopyToClipboard from '@/components/copyToClipboard/copyToClipboard';

export const metadata = {
    title: 'About Page',
    description: 'About Page',
};

const AboutPage = () => {
    return (
        <div className={styles.container}>
            <div className={styles.textContainer}>
                {/* this is like a small code block that can copy: npx create-next-app@latest */}
                {/* <h2 className={styles.subtitle}>npx create-next-app@latest</h2> */}
                <h1 className={styles.title}>
                    The React Framework for the Web.
                </h1>
                <p className={styles.desc}>
                    Used by some of the world's largest companies, Next.js
                    enables you to create high-quality web applications with the
                    power of React components.
                </p>
                {/* make this codeblock can be copied by a button */}
                {/* <div className={styles.codeblock}>
                    <pre className="font-mono flex flex-row justify-between">
                        <div className="flex flex-col">
                            <code className="language-bash">
                                npx create-next-app@latest my-app --tailwind
                            </code>
                            <code>npx shadcn-ui@latest init</code>
                        </div>
                        <Button variant="outline" size="icon">
                            <Copy color="#000000" />
                        </Button>
                    </pre>
                </div> */}
                <div className="flex flex-row justify-between">
                    <SyntaxHighlighter
                        language="bash"
                        style={docco}
                        className="font-mono flex flex-row justify-between w-11/12 rounded-md"
                    >
                        npx create-next-app@latest my-app --tailwind
                    </SyntaxHighlighter>
                    <CopyToClipboard text="npx create-next-app@latest my-app --tailwind" />
                </div>
                <div className={styles.boxes}>
                    {/* about nextjs 14 */}
                    <div className={styles.box}>
                        <h1 className="font-bold text-4xl">
                            14
                            <span className="text-2xl">th</span>
                        </h1>
                        <p className="flex items-center gap-2">
                            Largest <Github />
                        </p>
                        <Link
                            href="/"
                            className="font-mono text-gray-500 cursor-pointer underline hover:text-gray-700"
                        >
                            on Github
                        </Link>
                    </div>
                    <div className={styles.box}>
                        <h1 className="font-bold text-4xl">#1</h1>
                        <p className="flex items-center gap-2">
                            React <Code2 />
                        </p>
                        <Link
                            href="/"
                            className="font-mono text-gray-500 cursor-pointer underline hover:text-gray-700"
                        >
                            framework
                        </Link>
                    </div>
                    <div className={styles.box}>
                        <h1 className="font-bold text-4xl">110,000</h1>
                        <p className="flex items-center gap-2">
                            Stars <Star />
                        </p>
                        <Link
                            href="/"
                            className="font-mono text-gray-500 cursor-pointer underline hover:text-gray-700"
                        >
                            on Github
                        </Link>
                    </div>
                </div>
            </div>
            <div className={styles.imgContainer}>
                <Image
                    src="/about1.svg"
                    alt=""
                    fill
                    className="object-contain  dark:invert"
                />
            </div>
        </div>
    );
};

export default AboutPage;
/* The CSS code `.box p` is targeting the `<p>` elements inside elements with the
class "box". It sets the font size to 20 pixels and the font weight to normal.
This means that any paragraphs within elements with the class "box" will have a
font size of 20 pixels and a normal font weight. */
