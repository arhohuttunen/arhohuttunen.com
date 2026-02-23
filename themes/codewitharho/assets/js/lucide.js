import { createIcons } from 'lucide/dist/esm/lucide/src/lucide.js';
import { default as Bug } from 'lucide/dist/esm/lucide/src/icons/bug.js';
import { default as Check } from 'lucide/dist/esm/lucide/src/icons/check.js';
import { default as CircleCheck } from 'lucide/dist/esm/lucide/src/icons/circle-check.js';
import { default as CircleQuestionMark } from 'lucide/dist/esm/lucide/src/icons/circle-question-mark.js';
import { default as ClipboardList } from 'lucide/dist/esm/lucide/src/icons/clipboard-list.js';
import { default as Flame } from 'lucide/dist/esm/lucide/src/icons/flame.js';
import { default as Folder } from 'lucide/dist/esm/lucide/src/icons/folder.js';
import { default as Info } from 'lucide/dist/esm/lucide/src/icons/info.js';
import { default as List } from 'lucide/dist/esm/lucide/src/icons/list.js';
import { default as Menu } from 'lucide/dist/esm/lucide/src/icons/menu.js';
import { default as Moon } from 'lucide/dist/esm/lucide/src/icons/moon.js';
import { default as Pencil } from 'lucide/dist/esm/lucide/src/icons/pencil.js';
import { default as Quote } from 'lucide/dist/esm/lucide/src/icons/quote.js';
import { default as Search } from 'lucide/dist/esm/lucide/src/icons/search.js';
import { default as Sun } from 'lucide/dist/esm/lucide/src/icons/sun.js';
import { default as TriangleAlert } from 'lucide/dist/esm/lucide/src/icons/triangle-alert.js';
import { default as X } from 'lucide/dist/esm/lucide/src/icons/x.js';
import { default as Zap } from 'lucide/dist/esm/lucide/src/icons/zap.js';

document.addEventListener("DOMContentLoaded", () => {
    createIcons({
        icons: {
            Bug,
            Check,
            CircleCheck,
            CircleQuestionMark,
            ClipboardList,
            Flame,
            Folder,
            Info,
            List,
            Menu,
            Moon,
            Pencil,
            Quote,
            Search,
            Sun,
            TriangleAlert,
            X,
            Zap
        }
    });
});
