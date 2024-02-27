'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Copy, Check } from 'lucide-react';

const CopyToClipboard = ({ text }) => {
    const [copied, setCopied] = useState(false);
    return (
        <div>
            <Button
                variant="outline"
                size="icon"
                onClick={() => {
                    navigator.clipboard.writeText(text);
                    setCopied(true);
                }}
                className="transition-all duration-300 ease-in-out transform hover:scale-110"
            >
                {copied ? (
                    <Check className="dark:rotate-0 dark:scale-100" />
                ) : (
                    <Copy className="dark:rotate-0 dark:scale-100" />
                )}
            </Button>
        </div>
    );
};

export default CopyToClipboard;
