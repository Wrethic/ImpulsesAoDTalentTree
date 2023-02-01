WH.Wow.TalentCalcDragonflight = function () {
    const e = this;
    const t = WH.Device;
    const a = WH.Wow.Expansion;
    const n = WH.Highlight;
    const l = WH.Icon;
    const s = WH.Wow.PlayerClass;
    const i = WH.Wow.PlayerClass.Specialization;
    const o = WH.Strings;
    const r = WH.Url;
    this.EVENT_HASH_UPDATE = "hash-update";
    const c = "dragonflight-talent";
    const d = 17;
    const u = 10;
    const p = 1;
    const f = 2;
    const h = 3;
    const m = Object.seal({
        annotating: false,
        characterName: undefined,
        characterStates: {},
        defaultTitle: undefined,
        exportWidth: undefined,
        elements: Object.seal({
            abilities: undefined,
            actionsContainer: undefined,
            annotateButton: undefined,
            container: undefined,
            exportButton: undefined,
            exportMenu: undefined,
            footer: undefined,
            guideCard: undefined,
            guideContainer: undefined,
            guideText: undefined,
            guideTitle: undefined,
            heading: undefined,
            linkButton: undefined,
            pvpContainer: undefined,
            trees: undefined,
        }),
        pvp: undefined,
        skipHashUpdates: 0,
        trees: [],
    });
    const H = Object.seal({ dataEnv: undefined, editable: true, embedded: false, iframeEmbed: false, treeData: {}, treeTitles: [] });
    this.getBlizzardHash = function () {
        return q.getHash(m.trees);
    };
    function W(e) {
        WH.clickToCopy(e, () => q.getHash(m.trees));
    }
    function g(e) {
        let t = {};
        let a = e?.specializations?.specializations || [];
        a.forEach((e) => {
            let a = e?.specialization?.id;
            if (!a) {
                return;
            }
            let n = i.getClassId(a);
            let l = [
                { keyName: "selected_class_talents", treeId: n },
                { keyName: "selected_spec_talents", treeId: a },
            ];
            (e.loadouts || [])
                .sort((e, t) => (e.is_active ? 0 : 1) - (t.is_active ? 0 : 1))
                .forEach((n) => {
                    let s = { annotating: false, pvpTalents: (e.pvp_talent_slots || []).map((e) => e?.selected?.spell_tooltip?.spell?.id || 0).filter((e) => !!e), trees: [] };
                    l.forEach((e) => {
                        let t = [];
                        let l = [];
                        Object.values(H.treeData[e.treeId].talents)
                            .map((e) => e.filter((e) => (e.shownForSpecs || []).includes(a))[0] || e.filter((e) => !e.hasOwnProperty("shownForSpecs"))[0])
                            .filter((e) => !!e)
                            .sort((e, t) => e.cell - t.cell)
                            .forEach((a) => {
                                let s = n[e.keyName].find((e) => e.id === a.node);
                                if (!s || s.rank <= s.default_points) {
                                    l.push(0);
                                    return;
                                }
                                l.push(s.rank - (s.default_points || 0));
                                if (a.type === h) {
                                    t.push(
                                        Math.max(
                                            0,
                                            a.spells.findIndex((e) => e.definition === s.tooltip.talent.id)
                                        )
                                    );
                                }
                            });
                        while (l[l.length - 1] === 0) {
                            l.pop();
                        }
                        s.trees.push({ annotatedCells: {}, annotatedChoices: {}, annotatedConnections: {}, choices: t, points: l, treeId: e.treeId });
                    });
                    t[a] = t[a] || [];
                    t[a].push(s);
                });
        });
        return t;
    }
    function E(e) {
        m.elements.exportButton = WH.createButton("", "javascript:");
        WH.st(m.elements.exportButton, WH.TERMS.exportTalents);
        m.elements.exportButton.classList.add(`${c}-trees-tree-title-export`);
        WH.ae(e, m.elements.exportButton);
        if (H.iframeEmbed) {
            WH.st(m.elements.exportButton, WH.term("copy_format", WH.TERMS.talents));
            m.elements.exportButton.classList.add("fa", "fa-share-alt");
        }
        W(m.elements.exportButton);
    }
    function b(e, t) {
        let a = `${c}-related`;
        let n = v(t);
        if (!n) {
            return;
        }
        let l = WH.ce("section", { className: `${a}-guide-container` });
        let s = WH.ce("a", { className: `${a}-guide`, href: WH.Entity.getUrl(WH.Types.GUIDE, n.id), dataset: { disableWowheadTooltip: "true" } });
        let i = WH.ce("section", { className: `${a}-guide-icon` });
        let o = WH.ce("section", { className: `${a}-guide-content` });
        let r = WH.ce("section", { className: `${a}-guide-title` });
        let d = WH.ce("section", { className: `${a}-guide-text` });
        let u = WH.ce("section", { className: `${a}-guide-cta` });
        let p = WH.ce("section", { className: `${a}-guide-cta-text` }, WH.ct(WH.TERMS.readGuide));
        WH.ae(m.elements.container, l);
        WH.ae(l, s);
        WH.ae(s, i);
        WH.ae(s, o);
        WH.ae(o, r);
        WH.ae(o, d);
        WH.ae(s, u);
        WH.ae(s, u);
        WH.ae(u, p);
        m.elements.guideContainer = l;
        m.elements.guideCard = s;
        m.elements.guideTitle = r;
        m.elements.guideText = d;
        if (!H.iframeEmbed) {
            let e = { tiny: 425, small: 600, medium: 1024, large: 1310 };
            let t = new ResizeObserver((t) => {
                for (let a of t) {
                    if (a.contentRect.width < e.tiny) {
                        m.elements.guideContainer.dataset.size = "tiny";
                    } else if (a.contentRect.width < e.small) {
                        m.elements.guideContainer.dataset.size = "small";
                    } else if (a.contentRect.width < e.medium) {
                        m.elements.guideContainer.dataset.size = "medium";
                    } else if (a.contentRect.width < e.large) {
                        m.elements.guideContainer.dataset.size = "large";
                    } else {
                        delete m.elements.guideContainer.dataset.size;
                    }
                }
            });
            t.observe(m.elements.guideContainer);
        } else if (!m.pvp || Object.values(m.pvp.getEquipped()).length === 0) {
            l.dataset.addMargin = "true";
        }
        R(e, t, n);
    }
    function v(e) {
        return Object.values(T("specGuides")).find((t) => t.specid === e);
    }
    function T(e) {
        return WH.getPageData("wow.talentCalcDragonflight." + WH.getDataEnvKey(H.dataEnv) + "." + e);
    }
    function S(t, a) {
        WH.DOM.enableEvents(e);
        H.dataEnv = a.dataEnv || WH.getDataEnv();
        m.elements.container = t;
        m.elements.container.classList.add(c);
        m.elements.heading = a.heading;
        if ((m.elements.linkButton = a.linkButton)) {
            WH.clickToCopy(m.elements.linkButton, () => m.elements.linkButton.href);
        }
        if (a.namesButton) {
            let e = a.namesButton;
            WH.aE(e, "click", function () {
                let t = e.classList.toggle(`${c}-page-names-hide`);
                e.classList.toggle(`${c}-page-names-show`);
                if (t) {
                    m.elements.trees.dataset.textMode = 1;
                } else {
                    delete m.elements.trees.dataset.textMode;
                }
            });
        }
        if (a.annotateButton) {
            m.elements.annotateButton = a.annotateButton;
            WH.aE(m.elements.annotateButton, "click", x.bind(e, null));
        }
        H.editable = !a.hasOwnProperty("editable") || !!a.editable;
        H.embedded = !!a.embedded;
        H.iframeEmbed = !!a.iframeEmbed;
        if (H.iframeEmbed) {
            if (window.top === window) {
                location.href = location.href.replace(/embed\/?/, "");
                return;
            }
        }
        if (H.editable && a.resetButton) {
            WH.aE(a.resetButton, "click", () => {
                m.skipHashUpdates++;
                m.trees.forEach((e) => e.reset());
                m.pvp.setEquipped({});
                m.skipHashUpdates--;
                k();
            });
        }
        if (a.searchContainer) {
            y(a.searchContainer);
        }
        let n = T("trees");
        n.forEach((e) => (H.treeData[e.id] = e));
        if (!H.embedded) {
            C();
        }
        m.elements.trees = WH.ce("div", { className: c + "-trees" });
        WH.ae(m.elements.container, m.elements.trees);
        if (a.tree) {
            m.elements.trees.dataset.onlyTree = a.tree;
        }
        a.titleBar = !a.hasOwnProperty("titleBar") || !!a.titleBar;
        if (!a.titleBar) {
            m.elements.trees.dataset.noTitleBar = 1;
        }
        if (a.actionsContainer) {
            m.elements.actionsContainer = a.actionsContainer;
            m.elements.actionsContainer.classList.add(`${c}-actions`);
        }
        w(a.exportMenu);
        if (a.pvpContainer) {
            m.elements.pvpContainer = a.pvpContainer;
        } else {
            m.elements.pvpContainer = WH.ce("div");
            WH.ae(m.elements.container, m.elements.pvpContainer);
        }
        m.elements.footer = WH.qs(`.${c}-footer`, m.elements.container);
        if (window.ResizeObserver && !a.fixedSize) {
            let e = H.editable ? 1100 : 750;
            let t = new ResizeObserver((t) => {
                t.forEach((t) => {
                    switch (t.target) {
                        case m.elements.trees:
                            if (m.elements.exportButton && !m.exportWidth) {
                                m.exportWidth = m.elements.exportButton.getBoundingClientRect().width;
                                e = e + (m.exportWidth || 0);
                            }
                            if (m.elements.trees.scrollWidth < 500) {
                                m.elements.trees.dataset.narrow = 2;
                            } else if (m.elements.trees.scrollWidth < e) {
                                m.elements.trees.dataset.narrow = 1;
                            } else {
                                delete m.elements.trees.dataset.narrow;
                            }
                            if (a.titleBar && !a.tree && H.embedded) {
                                O();
                            }
                            break;
                        case m.elements.footer:
                            if (m.elements.trees.scrollWidth < 680) {
                                m.elements.footer.dataset.narrow = 2;
                            } else if (m.elements.trees.scrollWidth < 1260) {
                                m.elements.footer.dataset.narrow = 1;
                            } else {
                                delete m.elements.footer.dataset.narrow;
                            }
                            break;
                    }
                });
            });
            t.observe(m.elements.trees);
            if (m.elements.footer) {
                t.observe(m.elements.footer);
            }
        } else if (H.iframeEmbed) {
            WH.aE(m.elements.trees, "resize", () => O());
        }
        N();
        if (!H.embedded) {
            m.elements.abilities = WH.ce("div", { className: c + "-abilities" });
            WH.ae(m.elements.container, m.elements.abilities);
        }
        let l = { annotating: false, trees: [], pvpTalents: [] };
        A.init(l);
        {
            let e;
            if (a.hash) {
                let t = new RegExp("^blizzard/([a-zA-Z0-9/+]+)$").exec(a.hash);
                if (t) {
                    try {
                        e = q.readHash(t[1]);
                    } catch (t) {
                        e = A.parse("");
                    }
                } else {
                    e = A.parse(a.hash);
                }
            } else if (!H.embedded || H.iframeEmbed) {
                e = A.read();
            } else {
                e = WH.cOr({}, l);
            }
            B(e);
            if (!H.embedded) {
                WH.aE(window, "popstate", () => {
                    A.skipHistory = true;
                    B(A.read());
                    A.skipHistory = false;
                });
            }
        }
        if (!H.editable && (!m.pvp || Object.values(m.pvp.getEquipped()).length === 0)) {
            WH.displayNone(m.elements.pvpContainer);
        }
    }
    function C() {
        let a = (e) => m.trees.some((t) => e === t.getState().treeId);
        let n = WH.qs(`.${c}-classes-splash-inner`, m.elements.container);
        let o = WH.qs(`.${c}-classes-inner`, m.elements.container);
        if (!n || !o) {
            return;
        }
        s.getAll(H.dataEnv).forEach((r) => {
            let c = s.getName(r);
            let d = l.create(s.getIconName(r), l.MEDIUM, "javascript:");
            d.dataset.classId = r;
            let u = l.getLink(d);
            let p = d.cloneNode(true);
            let f = l.getLink(p);
            let h = [];
            i.getByClass(r, H.dataEnv).forEach((t) => {
                if (!H.treeData[t]) {
                    return;
                }
                h.push(
                    Menu.createItem({
                        crumb: t,
                        label: i.getName(t) || t,
                        url: B.bind(e, {
                            annotating: false,
                            trees: [
                                { treeId: r, points: [], choices: [] },
                                { treeId: t, points: [], choices: [] },
                            ],
                            pvpTalents: [],
                        }),
                        options: { checkedFunc: a.bind(null, t), tinyIcon: i.getIconName(t) || l.UNKNOWN },
                    })
                );
            });
            let m = WH.ce("span", { className: "c" + r }, WH.ct(c));
            if (h.length) {
                if (t.isTouch()) {
                    h.unshift(Menu.createItem({ label: c }));
                }
                Menu.add(u, h, { showAtElement: true });
                Menu.add(f, h, { showAtElement: true });
            } else {
                d.dataset.disabled = p.dataset.disabled = 1;
                let e = WH.ce("div");
                WH.ae(e, m);
                WH.ae(e, WH.ct(" (NYI)"));
                m = e;
            }
            WH.Tooltip.simpleNonTouch(u, m, undefined, { noWrap: true });
            WH.Tooltip.simpleNonTouch(f, m, undefined, { noWrap: true });
            WH.ae(n, p);
            WH.ae(o, d);
        });
    }
    function w(e) {
        if (!e) {
            return;
        }
        const t = WH.User.hasRole(U_GROUP_EMPLOYEE | U_GROUP_EDITOR);
        const a = "Include this build in the talent calc list for ALL USERS.";
        const l = "[=talent-build-%d]";
        let s = Menu.createItem({
            label: WH.TERMS.import,
            options: { className: `${c}-export q1`, hide: !H.editable },
            url: () =>
                Dialog.prompt(
                    (e) => {
                        try {
                            B(q.readHash(e.trim()));
                        } catch (e) {
                            alert(e);
                        }
                    },
                    { text: WH.TERMS.dragonflightTalentCalcDialog_tip, title: WH.TERMS.import, placeholder: WH.GlobalStrings.HUD_CLASS_TALENTS_IMPORT_INSTRUCTIONS }
                ),
        });
        let r;
        if (H.editable && !H.embedded && window.CreateCharacterLoader) {
            let e = (e) =>
                alert(
                    t.getCharacterErrorText() ||
                        WH.sprintf(WH.TERMS.errorfromblizzardbattlenet_format, e.character.substring(0, 1).toLocaleUpperCase() + e.character.substring(1).toLocaleLowerCase(), e.region.toLocaleUpperCase(), e.realmName)
                );
            let t = window.CreateCharacterLoader({
                parent: m.elements.container.parentNode,
                resultDiv: WH.ce("div"),
                resultFunc: (t, a, n) => {
                    let l = () => e({ character: t.name, region: a, realmName: t.realm.name });
                    m.characterStates = {};
                    m.characterName = undefined;
                    try {
                        m.characterStates = g(t);
                        if (Object.values(m.characterStates).length === 0) {
                            return l();
                        }
                    } catch (e) {
                        WH.error("Error converting Blizzard API data to states", e);
                        m.characterStates = {};
                        return l();
                    }
                    m.characterName = `${t.name} - ${a}-${t.realm.name}`;
                    let s = (m.trees[1] && m.trees[1].getTreeId()) || 0;
                    if (m.characterStates[s]) {
                        B(m.characterStates[s][0]);
                    } else {
                        let e = t.specializations.active_specialization && t.specializations.active_specialization.id;
                        if (m.characterStates[e]) {
                            B(m.characterStates[e][0]);
                        } else {
                            B(Object.values(m.characterStates)[0][0]);
                        }
                    }
                },
                errorFunc: e,
                fields: ["specializations"],
                skipFirstShow: true,
            });
            t.allowCancel = true;
            t.Init();
            r = Menu.createItem({ label: WH.TERMS.loadcharacter, options: { className: `${c}-export q1` }, url: () => t.ShowCharacterList() });
        }
        let d = Menu.createItem({ label: WH.TERMS.share, options: { className: `${c}-export q1`, note: WH.term("parens_format", "", WH.TERMS.copyToClipboard_lc) }, url: (e) => WH.copyToClipboard(q.getHash(m.trees), e) });
        let u = o.guid();
        Dialog.templates[u] = {
            title: "Save New Build",
            buttons: [
                ["check", WH.TERMS.ok],
                ["x", WH.TERMS.cancel],
            ],
            fields: [
                { id: "topText", type: "caption", label: "Save this build to the database, for markup and potentially for the public to load from here." },
                { id: "name", type: "text", size: 40, label: WH.TERMS.name + WH.TERMS.colon_punct },
                { id: "isListed", type: "checkbox", label: "Public:", options: [a] },
            ],
            onSubmit: (e) => D.add({ spec: m.trees[1].getTreeId(), hash: q.getHash(m.trees), name: e.name.value, isListed: e.isListed.checked }),
            onShow: function (e) {
                setTimeout(() => e.name.focus(), 50);
                setTimeout(Lightbox.reveal, 100);
            },
        };
        let p = Menu.createItem({ label: "Save New Build", options: { className: `${c}-export q2`, fontIcon: "plus", hide: !t, note: "(Staff)" }, url: () => new Dialog().show(u, { data: {} }) });
        let f;
        let h = o.guid();
        Dialog.templates[h] = {
            title: "Rename Build",
            buttons: [
                ["check", WH.TERMS.ok],
                ["x", WH.TERMS.cancel],
            ],
            fields: [
                { id: "topText", type: "caption", label: "Update the metadata for this build. The hash will NOT be changed." },
                { id: "name", type: "text", size: 40, label: WH.TERMS.name + WH.TERMS.colon_punct },
                { id: "isListed", type: "checkbox", label: "Public:", options: [a] },
            ],
            onSubmit: (e) => D.update(f.id, { name: e.name.value, isListed: e.isListed.checked }, (e) => alert(`Build [${e.name}] updated.`)),
            onShow: function (e) {
                setTimeout(() => e.name.focus(), 50);
                setTimeout(Lightbox.reveal, 100);
            },
        };
        let W = (e) => JSON.stringify([...e.map((e) => [e.choices, e.points, e.treeId])]);
        let E = (e) => {
            let a = [];
            if (!t) {
                return a;
            }
            a.push({ callback: (t) => WH.copyToClipboard(o.sprintf(l, e.id), t), fontIcon: "clipboard", tooltipText: "Copy Hash Markup" });
            a.push({
                callback: () => {
                    f = e;
                    new Dialog().show(h, { data: { name: e.name, isListed: e.isListed ? 0 : null } });
                },
                fontIcon: "pencil",
                tooltipText: "Rename / Hide/Show",
            });
            a.push({
                callback: () => confirm(`Overwrite [${e.name}] with the current talent selections?`) && D.update(e.id, { hash: q.getHash(m.trees) }, () => alert(`Hash for [${e.name}] has been updated.`)),
                fontIcon: "save",
                tooltipText: "Update Hash",
            });
            a.push({ callback: () => confirm(`Delete [${e.name}]? Markup tags using it will stop working.`) && D.remove(e.id, () => alert(`[${e.name}] has been deleted.`)), fontIcon: "times", tooltipClass: "q10", tooltipText: "Delete" });
            return a;
        };
        let b = function () {
            let e = [];
            let a = m.trees[1] && m.trees[1].getTreeId();
            let n = W(m.trees.map((e) => e.getState()));
            if (H.editable && m.characterName && m.characterStates[a] && m.characterStates[a].length) {
                e.push(Menu.createHeading({ label: m.characterName, options: { tinyIcon: i.getIconName(a) } }));
                m.characterStates[a].forEach((t, a) =>
                    e.push(Menu.createItem({ label: a === 0 ? WH.TERMS.active : `${WH.TERMS.inactive} ${a}`, url: () => B(t), options: { checkedFunc: () => n === W(t.trees), className: `${c}-export` } }))
                );
            }
            (() => {
                if (!H.editable) {
                    return;
                }
                let l = D.getAll(a);
                let s = [];
                let i = [];
                l.sort((e, t) => e.name.localeCompare(t.name) || e.id - t.id);
                l.forEach((e) => {
                    (e.isListed ? s : i).push(
                        Menu.createItem({
                            label: e.name,
                            url: () => {
                                try {
                                    B(q.readHash(e.hash));
                                } catch (e) {
                                    alert(e);
                                }
                            },
                            options: {
                                checkedFunc: () => {
                                    try {
                                        return n === W(q.readHash(e.hash).trees);
                                    } catch (e) {
                                        return false;
                                    }
                                },
                                className: `${c}-export blizzard-blue`,
                                extraActions: E(e),
                            },
                        })
                    );
                });
                if (s.length) {
                    e.push(Menu.createHeading({ label: WH.TERMS.wowheadBuilds }));
                    e = e.concat(s);
                }
                if (t && i.length) {
                    e.push(Menu.createHeading({ label: "Staff Only" }));
                    e = e.concat(i);
                }
                if (t) {
                    if (e.length) {
                        e.push(Menu.createSpacer());
                    }
                    e.push(p);
                }
            })();
            if (e.length) {
                e.push(Menu.createSpacer());
            }
            if (r) {
                e.push(r);
            }
            e.push(s);
            e.push(d);
            return e;
        };
        m.elements.exportMenu = e;
        m.elements.exportMenu.classList.add(`${c}-export-menu`);
        let v = WH.DOM.createImitationSelect({ menu: b });
        WH.ae(m.elements.exportMenu, v);
        WH.st(v, WH.TERMS.loadExportBuilds);
        setTimeout(() => {
            new n(`${c}-new-export-location`, v, WH.TERMS.talentCalcImportExportHighlight_tip, { position: "top" });
        });
        let T = WH.ce("a", { href: "javascript:", className: `${c}-export-menu-button fa fa-share-alt btn btn-site` });
        WH.ae(m.elements.exportMenu, T);
        WH.aE(T, "click", () => {
            m.elements.actionsContainer.dataset.currentTool = "menu";
        });
    }
    function N() {
        if (!H.iframeEmbed) {
            return;
        }
        let e = m.elements.container;
        let t = WH.qs(`.${c}-iframe-scroller[data-direction="left"]`, e);
        let a = WH.qs(`.${c}-iframe-scroller[data-direction="right"]`, e);
        let n = false;
        let l = function () {
            n = false;
            if (e.scrollLeft === 0) {
                WH.displayNone(t);
                WH.displayDefault(a);
            } else {
                WH.displayDefault(t);
                if (e.scrollLeft >= e.scrollWidth - e.clientWidth) {
                    WH.displayNone(a);
                } else {
                    WH.displayDefault(a);
                }
            }
        };
        WH.aE(e, "scroll", () => {
            if (!n) {
                requestAnimationFrame(l);
                n = true;
            }
        });
        l();
        WH.aE(e, "resize", () => l());
        WH.aE(t, "click", () => e.scrollTo({ top: e.scrollTop, left: 0, behavior: "smooth" }));
        WH.aE(a, "click", () => e.scrollTo({ top: e.scrollTop, left: e.scrollWidth - e.clientWidth, behavior: "smooth" }));
    }
    function y(e) {
        e.classList.add(`${c}-search`);
        let t = WH.ce("a", { href: "javascript:", className: `${c}-search-toggle fa fa-search btn btn-site` });
        WH.ae(e, t);
        let a = WH.ce("div", { className: `${c}-search-box` });
        WH.ae(e, a);
        WH.aE(t, "click", () => {
            m.elements.actionsContainer.dataset.currentTool = "search";
        });
        let n = WH.ce("input", { type: "text", className: `${c}-search-input`, placeholder: WH.TERMS.searchAllTalents });
        WH.ae(a, n);
        WH.ae(a, WH.ce("div", { className: `${c}-search-box-icon` }, WH.ce("span", { className: "fa fa-search" })));
        let l = WH.ce("a", { className: `${c}-search-box-clear`, href: "javascript:" }, WH.ce("span", { className: "fa fa-times-circle" }));
        WH.ae(a, l);
        let s = false;
        let i = () => {
            Menu.hide(true);
            let e = m.trees.reduce((e, t) => e.concat(t.search(n.value)), []);
            if (e.length === 0 || e.length >= 10) {
                delete m.elements.trees.dataset.found;
                return;
            }
            m.elements.trees.dataset.found = e.length;
            Menu.show(
                e
                    .sort((e, t) => e.name.localeCompare(t.name))
                    .map((e) =>
                        Menu.createItem({
                            label: e.name,
                            url: () => {
                                s = true;
                                n.value = e.name;
                                n.focus();
                                i();
                            },
                            options: { tinyIcon: e.icon },
                        })
                    ),
                n
            );
        };
        WH.aE(n, "input", () => {
            if (n.value === "") {
                delete l.dataset.shown;
            } else {
                l.dataset.shown = 1;
            }
        });
        WH.aE(n, "input", i);
        WH.aE(l, "click", () => {
            n.value = "";
            n.dispatchEvent(new Event("input"));
            n.dispatchEvent(new Event("change"));
        });
        WH.aE(n, "focus", () => (a.dataset.hasFocus = 1));
        WH.aE(n, "blur", () => {
            delete a.dataset.hasFocus;
            setTimeout(() => {
                if (!s) {
                    Menu.hide(true);
                }
                s = false;
            }, 150);
        });
    }
    function M(e, t) {
        if (!m.elements.abilities) {
            return;
        }
        new _(m.elements.abilities, e, t);
    }
    function $(e, t) {
        if (!m.elements.guideContainer) {
            b(e, t);
        } else {
            R(e, t);
        }
    }
    function I(t, a) {
        WH.ee(m.elements.trees);
        m.trees = [];
        let n = (e) => WH.qsa(`.${c}-classes-inner .iconmedium[data-class-id="${e}"]`, m.elements.container).forEach((e) => e.classList.add("iconmedium-gold-selected"));
        let l = (e, t) => {
            let a = s.getSlug(e, H.dataEnv);
            let n = i.getSlug(e, t, H.dataEnv);
            if (a && n) {
                m.elements.trees.dataset.classSpec = `${a}-${n}`;
            } else {
                delete m.elements.trees.dataset.classSpec;
            }
        };
        if (!H.embedded) {
            if (t.length) {
                m.elements.container.dataset.withTrees = 1;
            } else {
                delete m.elements.container.dataset.withTrees;
            }
            L(t[0], t[1]);
            WH.qsa(`.${c}-classes-inner .iconmedium-gold-selected`, m.elements.container).forEach((e) => e.classList.remove("iconmedium-gold-selected"));
            t.some((e) => s.getName(e) && n(e));
            delete m.elements.trees.dataset.classSpec;
            l(t[0], t[1]);
        }
        let o = () => {
            k();
            if (a) {
                a(t);
            }
        };
        if (t.length === 0) {
            o();
            return;
        }
        t.forEach((a, n) => {
            let l = WH.ce("div", { className: `${c}-trees-tree-background` });
            WH.ae(m.elements.trees, l);
            let s = WH.ce("div", { className: c + "-trees-tree", dataset: { tree: a } });
            WH.ae(l, s);
            m.trees.push(null);
            let i = H.treeData[a] || { id: a, checkpoints: [], talents: {} };
            m.trees[n] = new U(s, i, t[1], e);
            m.trees[n].setAnnotationMode(m.annotating);
            WH.aE(m.trees[n], m.trees[n].EVENT_CHANGE_STATE, k);
        });
        o();
    }
    function x(e) {
        if (e != null) {
            m.annotating = e;
        } else {
            m.annotating = !m.annotating;
        }
        if (m.elements.annotateButton) {
            m.elements.annotateButton.classList.toggle(`${c}-page-annotate-spend`, !m.annotating);
            m.elements.annotateButton.classList.toggle(`${c}-page-annotate-annotate`, m.annotating);
        }
        m.skipHashUpdates++;
        m.trees.forEach((e) => e.setAnnotationMode(m.annotating));
        m.skipHashUpdates--;
        k();
    }
    function k() {
        if (m.skipHashUpdates) {
            return;
        }
        let t = [];
        m.trees.forEach((e) => t.push(e.getState()));
        let a = [];
        if (m.pvp) {
            let e = m.pvp.getEquipped();
            Object.keys(e)
                .sort((e, t) => e - t)
                .forEach((t) => a.push(e[t]));
        }
        let n = A.write({ annotating: m.annotating, trees: t, pvpTalents: a });
        if (m.elements.linkButton) {
            m.elements.linkButton.href = n;
        }
        e.dispatchEvent(new CustomEvent(e.EVENT_HASH_UPDATE, { detail: n }));
        if (!H.embedded) {
            let e = [Menu.CRUMB_TOOLS, "0"];
            if (t.length === 2) {
                e.push(t[0].treeId, i.getNumber(t[0].treeId, t[1].treeId, H.dataEnv));
            }
            WH.Layout.set({ breadcrumb: e });
        }
    }
    function R(e, t, a) {
        let n = a || v(t);
        let l = n && T("guideURLs")[n.id];
        if (!n && !l) {
            m.elements.guideContainer.style.display = "none";
            return;
        } else {
            m.elements.guideContainer.style.display = "block";
            m.elements.guideCard.href = WH.Url.generatePath(l);
        }
        let o = s.getName(e);
        let r = s.getSlug(e);
        let c = i.getName(t);
        let d = i.getSlug(e, t);
        let u = i.getRoleName(T("specRoles")[t]);
        m.elements.guideContainer.dataset.class = r;
        m.elements.guideContainer.dataset.spec = d;
        WH.st(m.elements.guideTitle, WH.term("guideCardTitle_format", c, o, u));
        WH.st(m.elements.guideText, WH.term("guideCardDescription_format", c, o, u, WH.TERMS.dragonflight_expansion));
    }
    function L(e, t) {
        if (H.embedded) {
            return;
        }
        if (!m.defaultTitle) {
            m.defaultTitle = m.elements.heading.textContent;
        }
        let n = e && t ? WH.term("specClassExpansionTalentCalc_format", i.getName(t), s.getName(e), a.getName(a.get(H.dataEnv))) : m.defaultTitle;
        WH.st(m.elements.heading, n);
        WH.Layout.setTitle(n);
    }
    function O() {
        H.treeTitles.forEach((e) => (e.style.minHeight = null));
        if (!m.elements.trees.dataset.narrow) {
            let e = Math.max(...H.treeTitles.map((e) => e.getBoundingClientRect().height));
            H.treeTitles.forEach((t) => (t.style.minHeight = `${e}px`));
            WH.qsa(`.${c}-trees-divider[data-position="top"]`, m.elements.trees).forEach((t) => (t.style.bottom = `calc(100% - ${e}px)`));
            WH.qsa(`.${c}-trees-divider[data-position="middle"]`, m.elements.trees).forEach((t) => (t.style.top = `${e - 10}px`));
        }
    }
    function B(e) {
        if (m.elements.abilities) {
            WH.ee(m.elements.abilities);
        }
        m.skipHashUpdates++;
        m.trees = [];
        WH.ee(m.elements.trees);
        m.pvp = undefined;
        WH.ee(m.elements.pvpContainer);
        x(e.annotating);
        let t = [];
        e.trees.forEach((e) => t.push(e.treeId));
        t.sort((e, t) => e - t);
        I(t, (t) => {
            e.trees.forEach((e, t) => {
                m.trees[t].setState(e);
            });
            if (t.length === 2) {
                m.pvp = new P(m.elements.pvpContainer, t[1]);
                let a = {};
                e.pvpTalents.forEach((e, t) => e && (a[t] = e));
                m.pvp.setEquipped(a);
                WH.aE(m.pvp, m.pvp.EVENT_CHANGE_STATE, k);
                if (H.iframeEmbed) {
                    WH.ae(m.elements.trees, WH.ce("div", { className: "dragonflight-talent-trees-divider", dataset: { position: "top" } }));
                    WH.ae(m.elements.trees, WH.ce("div", { className: "dragonflight-talent-trees-divider", dataset: { position: "bottom" } }));
                    WH.ae(m.elements.trees, WH.ce("div", { className: "dragonflight-talent-trees-divider", dataset: { position: "middle" } }));
                }
            }
            m.skipHashUpdates--;
            k();
            if (t.length === 2) {
                M(t[0], t[1]);
                if (!H.embedded || H.iframeEmbed) {
                    $(t[0], t[1]);
                }
            }
        });
    }
    const _ = function () {
        const e = this;
        const t = WH.Entity;
        const a = WH.Icon;
        const n = WH.Wow.Skill;
        const l = "dragonflight-talent-abilities";
        const s = { container: undefined };
        function i(e) {
            let t = WH.ce("div", { className: `${l}-list` });
            let a = WH.ce("div", { className: `${l}-tabs` });
            WH.ae(s.container, a);
            new Tabs({
                onShow: (e) => (t.dataset.category = e.slug),
                parent: a,
                poundable: false,
                tabs: [
                    { name: WH.TERMS.all, options: { slug: "all" } },
                    { name: WH.TERMS["class"], options: { slug: "class" } },
                    { name: WH.TERMS.spec, options: { slug: "spec" } },
                    { name: WH.TERMS.glyphs, options: { slug: "glyphs" } },
                ],
            });
            let n = WH.ce("div", { className: `${l}-search` });
            WH.ae(s.container, n);
            let i = WH.ce("input", { placeholder: WH.term("searchWithin_format", WH.TERMS.abilities), type: "text" });
            WH.ae(n, i);
            WH.aE(i, ["input", "blur"], () => {
                let e = Array.from(WH.qsa("tr", t));
                let a = i.value.toLocaleLowerCase().match(/\S+/g) || [];
                e.forEach((e) => delete e.dataset.filtered);
                e.filter((e) => a.some((t) => !e.dataset.words.includes(t))).forEach((e) => (e.dataset.filtered = 1));
            });
            WH.ae(n, WH.ce("span", { className: `${l}-search-icon fa fa-search` }));
            WH.ae(s.container, t);
            let r = WH.ce("table", { className: `${l}-list-table` });
            WH.ae(t, r);
            e.forEach((e) => WH.ae(r, o(e)));
            return t;
        }
        function o(e) {
            let s = { [n.CATEGORY_GLYPHS]: "glyphs", [n.CATEGORY_SPECIALIZATION]: "spec" }[e.skillCategory] || "class";
            let i = WH.ce("tr", { className: `${l}-list-table-row`, dataset: { category: s } });
            let o = t.getUrl(WH.Types.SPELL, e.id, e.name, undefined, H.dataEnv);
            let r = [];
            let c;
            c = WH.ce("td", { className: `${l}-list-table-row-icon` }, a.create(e.icon, a.MEDIUM, o, { span: true }));
            WH.ae(i, c);
            c = WH.ce("td", { className: `${l}-list-table-row-name` }, WH.ce("a", { href: o, className: "q" }, WH.ct(e.name)));
            WH.ae(i, c);
            r.push(e.name);
            let d = e.passive ? WH.TERMS.passive : WH.TERMS.active;
            c = WH.ce("td", { className: `${l}-list-table-row-passive` }, WH.ct(d));
            WH.ae(i, c);
            r.push(d);
            c = WH.ce("td", { className: `${l}-list-table-row-level` }, WH.ct(WH.term("level_format", e.minLevel)));
            WH.ae(i, c);
            i.dataset.words = r.join(" ").toLocaleLowerCase();
            return i;
        }
        function r(e, t, a) {
            s.container = e;
            s.container.classList.add(l);
            WH.ee(s.container);
            WH.ae(s.container, WH.getMajorHeading(WH.TERMS.classAbilities, 3));
            let n = T("abilities");
            n = n.filter((e) => e.playerClass === t && (e.spec || a) === a).sort((e, t) => e.minLevel - t.minLevel || e.name.localeCompare(t.name));
            i(n);
        }
        r.apply(this, arguments);
    };
    const q = new (function () {
        const e = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
        const t = 8;
        const a = 6;
        const n = 16;
        const l = 128;
        const s = 8;
        const o = 6;
        const r = 1;
        this.getHash = function (e) {
            return new d(e).getExportString();
        };
        this.readHash = function (e) {
            return new c(e).getState();
        };
        const c = function () {
            const c = Object.seal({ currentExtractedBits: undefined, currentIndex: undefined, currentRemainingValue: undefined, dataValues: undefined, exportString: undefined, state: undefined });
            this.getState = function () {
                return c.state;
            };
            function d(e) {
                if (c.currentIndex >= c.dataValues.length) {
                    return null;
                }
                let t = 0;
                let a = e;
                let n = 0;
                while (a > 0) {
                    let e = o - c.currentExtractedBits;
                    let l = Math.min(e, a);
                    c.currentExtractedBits = c.currentExtractedBits + l;
                    let s = 1 << l;
                    let i = c.currentRemainingValue % s;
                    c.currentRemainingValue = c.currentRemainingValue >> l;
                    t += i << n;
                    n += l;
                    a -= l;
                    if (l < e) {
                        break;
                    }
                    c.currentIndex++;
                    c.currentExtractedBits = 0;
                    c.currentRemainingValue = c.dataValues[c.currentIndex];
                }
                return t;
            }
            function u(e) {
                c.exportString = e;
                h();
                let t = f();
                if (!t.valid) {
                    throw WH.GlobalStrings.LOADOUT_ERROR_BAD_STRING;
                }
                if (t.version !== r) {
                    throw WH.GlobalStrings.LOADOUT_ERROR_SERIALIZATION_VERSION_MISMATCH;
                }
                let a = i.getClassId(t.specId);
                let n = p();
                let l = T("nodes")[a] || [];
                let s = { annotating: false, pvpTalents: [], trees: [] };
                [a, t.specId].forEach((e) => {
                    let t = { annotatedCells: {}, annotatedChoices: {}, annotatedConnections: {}, choices: [], points: [], treeId: e };
                    let a = H.treeData[e];
                    let i = Object.keys(a.talents)
                        .map((e) => parseInt(e))
                        .sort((e, t) => e - t);
                    i.forEach((e) => {
                        let s = 0;
                        let i = null;
                        a.talents[e].forEach((e) => {
                            let t = l.indexOf(e.node);
                            if (t < 0) {
                                return;
                            }
                            let a = n[t];
                            if (!a || !a.isNodeSelected) {
                                return;
                            }
                            let o = a.choiceNodeSelection;
                            if (a.isPartiallyRanked) {
                                s = a.partialRanksPurchased;
                            } else {
                                s = e.spells[o].points;
                            }
                            if (e.spells.length > 1) {
                                i = o;
                            }
                        });
                        t.points.push(s);
                        if (i != null) {
                            t.choices.push(i);
                        }
                    });
                    while (t.points[t.points.length - 1] === 0) {
                        t.points.pop();
                    }
                    s.trees.push(t);
                });
                c.state = s;
            }
            function p() {
                let e = [];
                while (c.currentIndex < c.dataValues.length) {
                    let t = d(1);
                    let n = t === 1;
                    let l = false;
                    let s = 0;
                    let i = false;
                    let o = 0;
                    if (n) {
                        let e = d(1);
                        l = e === 1;
                        if (l) {
                            s = d(a);
                        }
                        let t = d(1);
                        i = t === 1;
                        if (i) {
                            o = d(2);
                        }
                    }
                    e.push({ isNodeSelected: n, isPartiallyRanked: l, partialRanksPurchased: s, isChoiceNode: i, choiceNodeSelection: o });
                }
                return e;
            }
            function f() {
                let e = t + n + l;
                let a = c.exportString.length * o;
                if (a < e) {
                    return { valid: false, version: 0, specId: 0, treeHash: [] };
                }
                let i = d(t);
                let r = d(n);
                let u = [];
                for (let e = l; e > 0; e -= s) {
                    u.push(d(s));
                }
                return { valid: true, version: i, specId: r, treeHash: u };
            }
            function h() {
                c.dataValues = [];
                c.exportString.split("").forEach((t) => c.dataValues.push(e.indexOf(t)));
                c.currentIndex = 0;
                c.currentExtractedBits = 0;
                c.currentRemainingValue = c.dataValues[c.currentIndex];
            }
            u.apply(this, arguments);
        };
        const d = function () {
            const i = Object.seal({ dataEntries: [] });
            this.getExportString = function () {
                let t = "";
                let a = 0;
                let n = 0;
                let l = 0;
                i.dataEntries.forEach((s) => {
                    let i = s.value;
                    let r = s.bitWidth;
                    l += r;
                    while (r > 0) {
                        let l = o - n;
                        let s = 1 << l;
                        let c = i % s;
                        i = i >> l;
                        a += c << n;
                        if (l > r) {
                            n = (n + r) % o;
                            r = 0;
                        } else {
                            t += e[a];
                            a = 0;
                            n = 0;
                            r -= l;
                        }
                    }
                });
                if (n > 0) {
                    t += e[a];
                }
                return t;
            };
            function c(e, t) {
                i.dataEntries.push({ bitWidth: e, value: t });
            }
            function d(e) {
                if (e.length !== 2) {
                    return;
                }
                let t = e[0].getTreeId();
                let a = e[1].getTreeId();
                p(r, a);
                u(T("nodes")[t] || [], e);
            }
            function u(e, t) {
                e.forEach((e) => {
                    let n = t.reduce((t, a) => t || a.getNodeInfo(e), null) || { entryIndex: 0, isChoiceNode: false, maxRanks: 0, ranksPurchased: 0 };
                    let l = n.ranksPurchased > 0;
                    let s = n.ranksPurchased != n.maxRanks;
                    c(1, l ? 1 : 0);
                    if (l) {
                        c(1, s ? 1 : 0);
                        if (s) {
                            c(a, n.ranksPurchased);
                        }
                        c(1, n.isChoiceNode ? 1 : 0);
                        if (n.isChoiceNode) {
                            c(2, n.entryIndex);
                        }
                    }
                });
            }
            function p(e, a) {
                c(t, e);
                c(n, a);
                for (let e = l; e > 0; e -= s) {
                    c(s, 0);
                }
            }
            d.apply(this, arguments);
        };
    })();
    const A = new (function () {
        const e = this;
        this.BASE_PATH = "/talent-calc";
        const t = 6;
        const a = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_";
        const n = 3;
        this.skipHistory = false;
        const l = { baseState: {}, lastPushUrl: "", wroteToLocation: false };
        this.build = function (e) {
            if (e.trees.length < 2) {
                return "";
            }
            let l = a[n];
            let r = [e.annotating ? 1 : 0];
            let c = false;
            e.trees.forEach((a) => {
                if (e.annotating) {
                    let e = (1 << t) - 1;
                    let n = 1 << (t - 1);
                    let l = [a.annotatedCells, a.annotatedChoices, a.annotatedConnections];
                    c = c || l.some((e) => Object.keys(e).length);
                    l.forEach((a) => {
                        let l = Object.keys(a).length;
                        if (l < n) {
                            r.push(l);
                        } else {
                            r.push(((l >> t) & e) | n, l & e);
                        }
                        let s = -1;
                        Object.keys(a)
                            .map((e) => parseInt(e))
                            .sort((e, t) => e - t)
                            .forEach((l) => {
                                let i = l - s - 1;
                                if (i < n) {
                                    r.push(i);
                                } else {
                                    r.push(((l >> t) & e) | n, l & e);
                                }
                                s = l;
                                r.push(a[l] & e);
                            });
                    });
                    return;
                }
                [a.points, a.choices].forEach((e) => {
                    let t = Math.ceil(e.length / 3);
                    r.push(t);
                    c = c || t > 0;
                    for (let t = 0; t < e.length; t += 3) {
                        r.push((e[t] << 4) | ((e[t + 1] || 0) << 2) | (e[t + 2] || 0));
                    }
                });
            });
            if (e.pvpTalents.length) {
                c = true;
                r.push(e.pvpTalents.length);
                e.pvpTalents.forEach((e) => o(e, r));
            }
            for (let e = 0; e < r.length; e++) {
                l += a.charAt(r[e]);
            }
            l = c ? "/" + l : "";
            let d = e.trees[0].treeId;
            let u = e.trees[1].treeId;
            l = s.getSlug(d, H.dataEnv) + "/" + i.getSlug(d, u, H.dataEnv) + l;
            return l;
        };
        this.init = function (e) {
            WH.cOr(l.baseState, e);
        };
        this.parse = function (e) {
            let n = WH.cOr({}, l.baseState);
            if (!e) {
                return n;
            }
            let o;
            let r;
            let d = /^([a-z-]+)\/([a-z-]+)(?:\/([a-zA-Z0-9_-]+)?)?$/.exec(e);
            if (!d) {
                return n;
            }
            {
                o = s.getBySlug(d[1], H.dataEnv);
                if (o) {
                    o = parseInt(o);
                }
                if (!o) {
                    return n;
                }
            }
            {
                r = i.getBySlug(d[1], d[2], H.dataEnv);
                if (r) {
                    r = parseInt(r);
                }
                if (!r) {
                    return n;
                }
            }
            n.trees = [
                { treeId: o, points: [], choices: [], annotatedCells: {}, annotatedChoices: {}, annotatedConnections: {} },
                { treeId: r, points: [], choices: [], annotatedCells: {}, annotatedChoices: {}, annotatedConnections: {} },
            ];
            let u = d[3];
            if (!u) {
                return n;
            }
            let p = a.indexOf(u.substring(0, 1));
            u = u.substring(1);
            if (!u.length) {
                return n;
            }
            if (p === 2) {
                let e = ["points", "choices"];
                let t = u.split("_", 2);
                t.forEach((t, a) => t.split("-", 2).forEach((t, l) => /\D/.test(t) || t.split("").forEach((t) => n.trees[a][e[l]].push(parseInt(t)))));
            } else if (p >= 1 && p <= 3) {
                let e = [];
                for (let t = 0; t < u.length; t++) {
                    e.push(a.indexOf(u.substring(t, t + 1)));
                }
                if (p >= 3) {
                    n.annotating = e.shift() !== 0;
                }
                let l = 0;
                while (e.length && l < 2) {
                    n.annotating ||
                        ["points", "choices"].forEach((t) => {
                            let a = e.shift();
                            let s = e.splice(0, a);
                            s.forEach((e) => n.trees[l][t].push(e >> 4, (e >> 2) & 3, e & 3));
                        });
                    n.annotating &&
                        ["Cells", "Choices", "Connections"].forEach((a) => {
                            a = `annotated${a}`;
                            let s = 1 << (t - 1);
                            let i = e.shift();
                            if (i & s) {
                                i = ((i & ~s) << t) | e.shift();
                            }
                            let o = -1;
                            while (i-- > 0) {
                                let i = e.shift();
                                if (i & s) {
                                    i = ((i & ~s) << t) | e.shift();
                                } else {
                                    i += o + 1;
                                }
                                n.trees[l][a][i] = e.shift();
                                o = i;
                            }
                        });
                    l++;
                }
                if (e.length) {
                    let t = e.shift();
                    while (e.length && t--) {
                        n.pvpTalents.push(c(e));
                    }
                }
            }
            return n;
        };
        this.read = function () {
            if (H.embedded && !H.iframeEmbed) {
                return this.parse("");
            }
            let t = r.removePathPrefixes(location.pathname);
            t = t.replace(new RegExp("^" + e.BASE_PATH + "/embed/"), `${e.BASE_PATH}/`);
            let a = new RegExp("^" + e.BASE_PATH + "/blizzard/([a-zA-Z0-9/+]+)$").exec(t);
            if (a) {
                try {
                    return q.readHash(a[1]);
                } catch (t) {
                    return e.parse("");
                }
            }
            let n = new RegExp("^" + e.BASE_PATH + "/([a-z-]+/[a-z-]+(?:/([a-zA-Z0-9_-]+)?)?)$");
            let l = n.exec(t);
            let s = l ? l[1] : "";
            return this.parse(s);
        };
        this.write = function (t) {
            l.wroteToLocation = false;
            let a = this.build(t);
            let n = r.generate(e.BASE_PATH + (a ? "/" + a : ""), { dataEnv: H.dataEnv });
            if (!e.skipHistory && !H.embedded && n !== l.lastPushUrl) {
                try {
                    WH.Url.pushHistory(n);
                    l.wroteToLocation = true;
                } catch (e) {}
                l.lastPushUrl = n;
            }
            return n;
        };
        this.wroteToLocation = function () {
            return l.wroteToLocation;
        };
        function o(e, a) {
            let n = (1 << t) - 1;
            let l = 1 << (t - 1);
            if (e < 1 << (t * 3 - 1)) {
                a.push((e >> (t * 2)) & n, (e >> t) & n, e & n);
            } else {
                a.push(l | ((e >> (t * 3)) & n), (e >> (t * 2)) & n, (e >> t) & n, e & n);
            }
        }
        function c(e) {
            let a = 1 << (t - 1);
            let n = e.shift();
            if ((n & a) !== 0) {
                n = n & (a - 1);
                return (n << (t * 3)) | (e.shift() << (t * 2)) | (e.shift() << t) | e.shift();
            }
            return (n << (t * 2)) | (e.shift() << t) | e.shift();
        }
    })();
    const P = function () {
        const e = this;
        const t = WH.Entity;
        const a = WH.Icon;
        this.EVENT_CHANGE_STATE = "change-state";
        const n = 3;
        const l = Object.seal({ elements: Object.seal({ container: undefined }), equipped: {}, pending: 0, playerSpec: undefined, talentData: [] });
        this.getEquipped = function () {
            return WH.cO({}, l.equipped);
        };
        this.setEquipped = function (e) {
            l.pending++;
            for (let t = 0; t < n; t++) {
                d(t, null);
                if (l.talentData.some((a) => a.id === e[t])) {
                    d(t, e[t]);
                }
            }
            l.pending--;
            o();
        };
        function s(e, n) {
            l.talentData
                .sort((e, t) => {
                    if (l.equipped[n] === e.id) return -1;
                    if (l.equipped[n] === t.id) return 1;
                    let a = Object.values(l.equipped).indexOf(e.id);
                    let s = Object.values(l.equipped).indexOf(t.id);
                    return a - s || e.name.localeCompare(t.name);
                })
                .forEach((s) => {
                    let i = WH.ce("a", { href: t.getUrl(WH.Types.SPELL, s.id, s.name, undefined, H.dataEnv), className: `${c}-pvp-list-line`, dataset: { tooltipMode: "icon" } });
                    WH.ae(e, i);
                    WH.aE(i, "click", (e) => {
                        e.preventDefault();
                        d(n, s.id);
                    });
                    if (Object.values(l.equipped).includes(s.id)) {
                        i.dataset.selected = 1;
                        if (l.equipped[n] !== s.id) {
                            i.dataset.elsewhere = 1;
                        }
                    }
                    WH.ae(i, WH.ce("img", { src: a.getIconUrl(s.icon, a.LARGE) }));
                    WH.ae(i, WH.ct(s.name));
                });
            if (l.equipped[n]) {
                let t = WH.ce("a", { href: "javascript:", className: `${c}-pvp-list-line`, dataset: { clear: 1 } });
                WH.ae(e, t);
                WH.aE(t, "click", () => d(n, null));
                WH.ae(t, WH.ce("img", { src: a.getIconUrl("spell_chargenegative", a.LARGE) }));
                WH.ae(t, WH.ct(WH.TERMS.clearSlot));
            }
        }
        function i() {
            let e = WH.ce("span", { className: `${c}-pvp-label` });
            WH.ae(e, WH.ce("span", { className: `${c}-pvp-label-full` }, WH.ct(WH.TERMS.pvptalents + WH.TERMS.colon_punct)));
            WH.ae(e, WH.ce("span", { className: `${c}-pvp-label-narrow` }, WH.ct(WH.TERMS.pvp + WH.TERMS.colon_punct)));
            WH.ae(l.elements.container, e);
            for (let e = 0; e < n; e++) {
                let t = WH.ce("a", { className: `${c}-pvp-talent`, dataset: { slot: e, tooltipMode: "icon", noTouchLightbox: "true" }, href: "javascript:" });
                WH.ae(l.elements.container, t);
                let a = WH.ce("div", { className: `${c}-pvp-talent-button` });
                WH.ae(t, a);
                let n = WH.ce("div", { className: `${c}-pvp-talent-icon` });
                WH.ae(a, n);
                let s = WH.ce("div", { className: `${c}-pvp-talent-cover` });
                WH.ae(a, s);
                if (H.editable) {
                    WH.aE(t, "click", u.bind(null, e));
                } else {
                    if (!H.iframeEmbed) {
                        WH.aE(t, "click", (e) => e.preventDefault());
                    }
                    t.dataset.readOnly = 1;
                }
            }
        }
        function o() {
            if (l.pending <= 0) {
                e.dispatchEvent(new CustomEvent(e.EVENT_CHANGE_STATE));
            }
        }
        function r(t, a) {
            WH.DOM.enableEvents(e);
            l.elements.container = t;
            l.elements.container.classList.add(`${c}-pvp`);
            WH.ee(l.elements.container);
            l.playerSpec = a;
            l.talentData = T("pvp").filter((e) => e.specs.includes(l.playerSpec));
            i();
        }
        function d(e, n) {
            l.pending++;
            let s = WH.qs(`.${c}-pvp-talent[data-slot="${e}"]`, l.elements.container);
            let i = WH.qs(`.${c}-pvp-talent-icon`, s);
            if (n) {
                let o = WH.findKey(l.equipped, n, true);
                if (o != null) {
                    d(o, null);
                }
                let r = l.talentData.find((e) => e.id === n);
                l.equipped[e] = n;
                s.href = t.getUrl(WH.Types.SPELL, r.id, r.name, undefined, H.dataEnv);
                s.dataset.filled = 1;
                i.style.backgroundImage = `url("${a.getIconUrl(r.icon, a.LARGE)}")`;
            } else {
                delete l.equipped[e];
                delete s.dataset.filled;
                s.href = "javascript:";
                i.style.backgroundImage = "";
            }
            l.pending--;
            o();
        }
        function u(e, t) {
            t.preventDefault();
            let a = WH.qs(`.${c}-pvp-talent[data-slot="${e}"]`, l.elements.container);
            if (WH.qs(`.${c}-pvp-list`, a)) {
                return;
            }
            let n;
            let i;
            WH.ae(a, (n = WH.ce("a", { className: `${c}-pvp-list`, href: "javascript:" })));
            WH.ae(n, WH.ce("div", { className: `${c}-pvp-list-arrow` }));
            WH.ae(n, (i = WH.ce("div", { className: `${c}-pvp-list-inner` })));
            s(i, e);
            WH.ae(i, WH.ce("div", { className: `${c}-pvp-list-close fa fa-times`, tabIndex: "0" }));
            window.requestAnimationFrame(() => WH.aE(window, "click", () => n.parentNode.removeChild(n), { once: true }));
            WH.aE(n, "click", (e) => (e.target === i || !i.contains(e.target)) && e.stopPropagation());
        }
        r.apply(this, arguments);
    };
    const D = new (function () {
        const e = Object.seal({ builds: T("talentBuilds") || {} });
        this.add = function (t, a) {
            WH.fetch(r.generate("/admin/markup/add-talent-build"), {
                json: t,
                success: (t) => {
                    e.builds[t.id] = t;
                    a && a(t);
                },
                error: (e) => {
                    let t = `Unable to save build: ${e.error}`;
                    WH.error(t);
                    alert(t);
                },
            });
        };
        this.getAll = function (t) {
            return Object.values(e.builds)
                .filter((e) => e.spec === t)
                .map((e) => ({ ...e }));
        };
        this.remove = function (t, a) {
            WH.fetch(r.generate("/admin/markup/delete-talent-build"), {
                json: { id: t },
                success: (n) => {
                    delete e.builds[t];
                    a && a();
                },
                error: (e) => {
                    let t = `Unable to delete build: ${e.error}`;
                    WH.error(t);
                    alert(t);
                },
            });
        };
        this.update = function (t, a, n) {
            WH.fetch(r.generate("/admin/markup/update-talent-build"), {
                json: { id: t, ...a },
                success: (t) => {
                    e.builds[t.id] = t;
                    n && n(t);
                },
                error: (e) => {
                    let t = `Unable to update build: ${e.error}`;
                    WH.error(t);
                    alert(t);
                },
            });
        };
    })();
    const U = function () {
        const e = this;
        const t = WH.Device;
        const a = WH.Wow.Item;
        this.EVENT_CHANGE_STATE = "change-state";
        const n = [
            { id: 1, color: a.getQualityColor("", true), name: WH.TERMS.yellow },
            { id: 2, color: a.getQualityColor(1, true), name: WH.TERMS.white },
            { id: 3, color: a.getQualityColor(2, true), name: WH.TERMS.green },
            { id: 4, color: a.getQualityColor(3, true), name: WH.TERMS.blue },
            { id: 5, color: a.getQualityColor(4, true), name: WH.TERMS.purple },
            { id: 6, color: a.getQualityColor(5, true), name: WH.TERMS.orange },
            { id: 7, color: a.getQualityColor(6, true), name: WH.TERMS.gold },
            { id: 8, color: a.getQualityColor(7, true), name: WH.TERMS.lightBlue },
            { id: 9, color: a.getQualityColor(10, true), name: WH.TERMS.red },
        ];
        const r = 12;
        const f =
            'url(\'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg"><defs>' +
            '<filter id="tint" color-interpolation-filters="sRGB">' +
            '<feColorMatrix type="matrix" values="3 0 0 0 0 0 3 0 0 0 0 0 3 0 0 0 0 0 1 0"/>' +
            '<feColorMatrix type="matrix" values="%f 0 0 0 0 0 %f 0 0 0 0 0 %f 0 0 0 0 0 1 0"/>' +
            "</filter></defs></svg>#tint')";
        const m = Object.seal({
            annotating: false,
            annotatedCells: {},
            annotatedChoices: {},
            annotatedConnections: {},
            checkpoints: [],
            choices: {},
            elements: Object.seal({ container: undefined, grid: undefined, openCalcButton: undefined, subtitle: undefined }),
            maxPoints: 0,
            pairedSpec: 0,
            points: {},
            requiredLevelBase: 1,
            sharedStrings: {},
            talents: {},
            treeId: undefined,
        });
        this.getNodeInfo = function (e) {
            let t = Object.values(m.talents).find((t) => t.node === e);
            if (!t) {
                return;
            }
            let a = m.choices[t.cell] || 0;
            return { entryIndex: a, isChoiceNode: t.type === h, maxRanks: t.spells[a].points, ranksPurchased: m.points[t.cell] || 0 };
        };
        this.getState = function () {
            if (m.annotating) {
                return { annotatedCells: WH.cO({}, m.annotatedCells), annotatedChoices: WH.cO({}, m.annotatedChoices), annotatedConnections: WH.cO({}, m.annotatedConnections), choices: [], points: [], treeId: m.treeId };
            }
            let e = [];
            let t = [];
            Object.values(m.talents)
                .sort((e, t) => e.cell - t.cell)
                .forEach((a) => {
                    let n = M(a.cell);
                    e.push(n);
                    if (n > 0 && a.type === h) {
                        t.push(m.choices[a.cell] || 0);
                    }
                });
            while (e[e.length - 1] === 0) {
                e.pop();
            }
            return { annotatedCells: {}, annotatedChoices: {}, annotatedConnections: {}, choices: t, points: e, treeId: m.treeId };
        };
        this.getTreeId = function () {
            return m.treeId;
        };
        this.reset = function () {
            if (m.annotating) {
                m.annotatedCells = {};
                m.annotatedChoices = {};
                m.annotatedConnections = {};
            } else {
                m.points = [];
                m.choices = {};
            }
            A();
            S();
        };
        this.search = function (e) {
            WH.qsa(`.${c}-tree-talent-found[data-active]`, m.elements.grid).forEach((e) => delete e.dataset.active);
            let t = e.toLowerCase().match(/\S+/g) || [];
            if (!t.length) {
                return [];
            }
            let a = [];
            let n = Object.values(m.talents).filter((e) => {
                let n = e.spells.filter((e) => t.every((t) => `${e.name} ${e.descriptionSearch}`.toLowerCase().includes(t)));
                a = a.concat(n);
                return n.length > 0;
            });
            n.map((e) => WH.qs(`.${c}-tree-talent-found[data-cell="${e.cell}"]`, m.elements.grid)).forEach((e) => (e.dataset.active = 1));
            return a;
        };
        this.setAnnotationMode = function (e) {
            if (m.annotating === e) {
                return;
            }
            m.annotating = e;
            if (m.annotating) {
                L();
                m.elements.container.dataset.annotating = 1;
            } else {
                delete m.elements.container.dataset.annotating;
            }
            A();
            S();
        };
        this.setState = function (e) {
            m.points = {};
            m.choices = {};
            m.annotatedCells = {};
            m.annotatedChoices = {};
            m.annotatedConnections = {};
            if (m.annotating) {
                m.annotatedChoices = WH.cO({}, e.annotatedChoices);
                m.annotatedCells = WH.cO({}, e.annotatedCells);
                m.annotatedConnections = WH.cO({}, e.annotatedConnections);
                A();
                return;
            }
            let t = (e.points || []).slice();
            let a = (e.choices || []).slice();
            Object.values(m.talents)
                .sort((e, t) => e.cell - t.cell)
                .forEach((e, n) => {
                    if (t[n]) {
                        m.points[e.cell] = t[n];
                        if (e.type === h) {
                            m.choices[e.cell] = a.shift() || 0;
                        }
                    }
                });
            A();
        };
        function W(a) {
            m.talents[a.cell] = a;
            let n = $(a.cell);
            let s = WH.ce("a", { className: c + "-tree-talent", dataset: { row: n.row, column: n.column, cell: a.cell, talentType: a.type, tooltipMode: "icon", noTouchLightbox: "true" }, href: "javascript:" });
            WH.ae(m.elements.grid, s);
            s._fixTooltip = w.bind(e, s);
            let i = ((e) => {
                let t = m.talents[e];
                let a = WH.ce("div");
                let n = 0;
                let l = (m.annotating ? m.annotatedChoices : m.choices)[e];
                let i = l || 0;
                if (t.type === h && l == null) {
                    WH.ae(a, WH.ce("b", { className: "q2" }, WH.ct(WH.TERMS.chooseOne_stc + WH.TERMS.colon_punct)));
                    t.spells.forEach((e, t) => {
                        let l = WH.ce("div", { className: `${c}-tooltip-replacement`, style: "margin-top: 1.5em; width: 300px" });
                        WH.ae(a, l);
                        if (e.spell) {
                            let i = undefined;
                            if (e.hasRankDescription) {
                                i = { def: e.definition, rank: 1 };
                            }
                            $WowheadPower.replaceWithTooltip(l, WH.Types.SPELL, e.spell, undefined, undefined, i, (e) => {
                                if (--n <= 0) {
                                    requestAnimationFrame(() => WH.Tooltip.show(s, a));
                                }
                                return D(s, t, e);
                            });
                            n++;
                        } else {
                            WH.ae(l, x(e));
                        }
                    });
                } else {
                    if (t.spells[i].spell) {
                        $WowheadPower.triggerTooltip(s);
                    } else {
                        WH.ae(a, x(t.spells[i]));
                    }
                }
                if (n === 0 && a.textContent !== "") {
                    WH.Tooltip.show(s, a);
                }
            }).bind(null, a.cell);
            WH.aE(s, "mouseout", WH.Tooltip.hide);
            if (a.type === h) {
                a.spells.forEach((e, t) => {
                    s.dataset["choiceHref" + t] = e.spell ? WH.Entity.getUrl(WH.Types.SPELL, e.spell, e.spellName || e.name, undefined, H.dataEnv) : "javascript:";
                });
                g(s, a);
                if (t.isTouch()) {
                    WH.aE(s, "click", i);
                }
            } else {
                let t = a.spells[0] || {};
                if (t.spell) {
                    let e = !t.hasRankDescription ? undefined : { def: t.definition, rank: 1 };
                    s.href = WH.Entity.getUrl(WH.Types.SPELL, t.spell, t.spellName || t.name, e, H.dataEnv);
                }
                WH.aE(s, "click", q.bind(e, a.cell, null, null, i), { capture: true });
            }
            WH.aE(s, "contextmenu", q.bind(e, a.cell, null, null, i), { capture: true });
            WH.Tooltip.simpleNonTouch(s, i);
            let o = WH.ce("div", { className: `${c}-tree-talent-name` });
            WH.ae(s, o);
            a.spells.forEach((e) => {
                WH.ae(o, WH.ct((o.hasChildNodes() ? " / " : "") + e.name));
            });
            let r = WH.ce("div", { className: c + "-tree-talent-boundary" });
            WH.ae(s, r);
            let d = WH.ce("div", { className: c + "-tree-talent-inner" });
            WH.ae(r, d);
            WH.ae(r, WH.ce("div", { className: c + "-tree-talent-boundary-frame" }));
            let u = [];
            a.spells.forEach((e, t) => (t === 0 || a.type === h) && e.icon && u.push('url("' + l.getIconUrl(e.icon, l.LARGE) + '"), ' + 'url("' + l.getIconUrl(l.UNKNOWN, l.LARGE) + '")'));
            u.forEach((e) => WH.ae(d, WH.ce("div", { className: c + "-tree-talent-inner-background", style: { backgroundImage: e } })));
            WH.ae(m.elements.grid, WH.ce("div", { className: c + "-tree-talent-points", dataset: { row: n.row, column: n.column, cell: a.cell, talentType: a.type } }));
            WH.ae(m.elements.grid, WH.ce("div", { className: `${c}-tree-talent-found`, dataset: { row: n.row, column: n.column, cell: a.cell, talentType: a.type } }));
        }
        function g(a, n) {
            if (!H.editable) {
                WH.aE(a, "click", (e) => e.preventDefault());
                return;
            }
            let l = [];
            let s = (e) => (m.annotating ? m.annotatedChoices : m.choices)[n.cell] === e;
            n.spells.forEach((a, i) => {
                let o = y(n.cell, i);
                let r;
                let c = !t.isTouch() && a.spell ? WH.Entity.getUrl(WH.Types.SPELL, a.spell, a.spellName || a.name, undefined, H.dataEnv) : undefined;
                if (o > 1) {
                    let l = [];
                    for (let r = 1; r <= o; r++) {
                        l.push(
                            Menu.createItem({
                                label: WH.sprintf(WH.TERMS.rank_format, r),
                                url: q.bind(e, n.cell, i, r, null, null),
                                options: { checkedFunc: s.bind(null, i), tinyIcon: a.icon, tooltip: c, tooltipContent: t.isTouch() || a.spell ? undefined : x.bind(null, a) },
                            })
                        );
                    }
                    r = Menu.createItem({ label: a.name, options: { checkedFunc: s.bind(null, i), tinyIcon: a.icon, tooltip: c, tooltipContent: t.isTouch() || a.spell ? undefined : x.bind(null, a) }, submenu: l });
                } else {
                    r = Menu.createItem({
                        label: a.name,
                        url: q.bind(e, n.cell, i, 1, null, null),
                        options: { checkedFunc: s.bind(null, i), tinyIcon: a.icon, tooltip: c, tooltipContent: t.isTouch() || a.spell ? undefined : x.bind(null, a) },
                    });
                }
                l.push(r);
            });
            l.push(Menu.createItem({ label: WH.TERMS.annotate, submenu: N(n.cell, false), options: { condition: () => m.annotating } }));
            WH.aE(a, "click", (e) => {
                e.preventDefault();
                if (!_(n.cell)) {
                    return;
                }
                Menu.show(l, a);
            });
        }
        function b(e, t) {
            if (t == null) {
                delete m.annotatedCells[e];
            } else {
                m.annotatedCells[e] = t;
            }
            A();
            S();
        }
        function v(e, t) {
            if (t == null) {
                delete m.annotatedConnections[e];
            } else {
                m.annotatedConnections[e] = t;
            }
            A();
            S();
        }
        function S() {
            e.dispatchEvent(new CustomEvent(e.EVENT_CHANGE_STATE));
        }
        function C(e, t) {
            let a = $(e);
            let n = $(t);
            let l = m.elements.grid;
            let s = l.parentNode;
            let i = 100 / (d + 1);
            let o = 100 / u;
            let f = (i * 2) / o;
            let h = a.column * i;
            let W = (a.row - 0.5) * o;
            let g = n.column * i;
            let E = (n.row - 0.5) * o;
            let b = Math.sqrt(Math.pow(h - g, 2) + Math.pow((W - E) * f, 2));
            let v = Math.atan(((E - W) * f) / (g - h));
            if (g < h) {
                v += Math.PI;
            }
            let T = (e, t, a) => (1 - a) * e + a * t;
            let S = m.talents[t].type;
            if (S === p) {
                let e = Math.PI / 2;
                let t = e / 2;
                let a = Math.abs(((t + v) % e) - t);
                b -= T(0, 0.5, a);
            }
            let C = WH.qsa(`.${c}-tree-connection`, s).length;
            let w = (1 / (d - 2)) * 100;
            b -= w / 2;
            let y = WH.ce("div", { className: c + "-tree-connection", dataset: { fromCell: e, toCell: t, index: C }, style: { left: `${h}%`, top: `${W}%`, transform: `rotate(${v}rad)`, width: `calc(${b}% - ${r / 2}px)` } });
            WH.ae(y, WH.ce("div", { className: `${c}-tree-connection-line` }));
            WH.ae(y, WH.ce("div", { className: `${c}-tree-connection-arrow` }));
            WH.ae(s, y);
            if (H.editable) {
                WH.aE(y, "click", () => m.annotating && Menu.show(N(C, true), y));
            }
        }
        function w(e, t) {
            t = D(e, null, t);
            let a;
            let n = parseInt(e.dataset.cell);
            let l = m.talents[n];
            if (l.cannotDecreaseError && y(n) === 0) {
                let e = m.sharedStrings[l.cannotDecreaseError];
                if (e) {
                    a = o.renderBlizzardUiEscapedString(e);
                }
            }
            if (!a && l.cannotIncreaseError && l.requiredPoints) {
                let e = l.requiredPoints - I($(n).row);
                if (e > 0) {
                    let t = m.sharedStrings[l.cannotIncreaseError];
                    if (t) {
                        t = o.sprintf(t, e);
                        a = o.renderBlizzardUiEscapedString(t);
                    }
                }
            }
            if (a) {
                let e = WH.ce("div", { innerHTML: t });
                let n = WH.qs(":scope > table:nth-child(2) td", e);
                if (n) {
                    WH.ae(n, WH.ce("div", { className: "q10", style: { marginTop: "1.25em" } }, a));
                    t = e.innerHTML;
                }
            }
            return t;
        }
        function N(e, t) {
            let a = t ? v : b;
            let l = t ? "annotatedConnections" : "annotatedCells";
            return [Menu.createItem({ label: "", url: () => a(e, null), options: { checkedFunc: () => !m[l].hasOwnProperty(e) } })].concat(
                n.map((t) => Menu.createItem({ label: "â¬¤ " + t.name, url: () => a(e, t.id), options: { checkedFunc: () => m[l][e] === t.id, className: `${c}-annotation-menu-${t.id}` } }))
            );
        }
        function y(e, t) {
            if (m.annotating) {
                return 1;
            }
            let a = m.talents[e];
            let n = a.defaultSpecs || [];
            if (n.some((e) => e === m.pairedSpec)) {
                return 0;
            }
            if (t == null) {
                t = m.choices[e] || 0;
            }
            return m.talents[e].spells[t].points;
        }
        function M(e) {
            return (!m.annotating && m.points[e]) || 0;
        }
        function $(e) {
            return { column: (e % d) + 1, row: Math.floor(e / d) + 1 };
        }
        function I(e) {
            return Object.values(m.talents)
                .filter((t) => $(t.cell).row < e)
                .reduce((e, t) => e + M(t.cell), 0);
        }
        function x(e) {
            let t = document.createDocumentFragment();
            WH.ae(t, WH.ce("b", {}, WH.ct(e.name)));
            WH.ae(t, WH.ce("br"));
            WH.ae(t, WH.ce("span", { className: "q" }, WH.markup.getDomFragment(e.description)));
            return t;
        }
        function k() {
            return m.annotating ? 0 : Object.values(m.points).reduce((e, t) => e + t, 0);
        }
        function R(t, a, n, l) {
            m.elements.container = t;
            m.treeId = a.id;
            m.pairedSpec = n;
            let o = !!i.getName(a.id);
            m.maxPoints = o ? 30 : 31;
            m.requiredLevelBase = o ? 11 : 10;
            m.elements.container.dataset.treeType = o ? "spec" : "class";
            if (!H.editable) {
                m.elements.container.dataset.readOnly = 1;
            }
            m.checkpoints = a.checkpoints;
            m.sharedStrings = T("sharedStrings");
            let r = a.id;
            if (o) {
                r = s.getBySpec(a.id, H.dataEnv);
            }
            WH.DOM.enableEvents(e);
            O(r, l);
            B(r);
            Object.values(a.talents).forEach((e) => {
                let t = e.filter((e) => (e.shownForSpecs || []).includes(n))[0] || e.filter((e) => !e.hasOwnProperty("shownForSpecs"))[0];
                if (t) {
                    W(t);
                }
            });
            Object.values(m.talents).forEach((e) => e.requires.sort((e, t) => e - t).forEach((t) => C(t, e.cell)));
            A();
            WH.aE(m.elements.grid, "click", (e) => {
                WH.qsa("[data-showing-touch-tooltip]", m.elements.grid).forEach((t) => {
                    if (t !== e.target) {
                        delete t.dataset.showingTouchTooltip;
                    }
                });
            });
            S();
        }
        function L() {
            let e = `${c}-annotation-menu-styles`;
            if (WH.qs(`#${e}`)) {
                return;
            }
            let t = WH.ce("style", { id: e });
            document.head.appendChild(t);
            n.forEach((e) => {
                t.sheet.insertRule(`.menu a.${c}-annotation-menu-${e.id} {color: ${e.color}}`, t.sheet.cssRules.length);
            });
        }
        function O(e, t) {
            let a = m.treeId !== e;
            let n = a ? m.treeId : m.pairedSpec;
            let o = WH.ce("div", { className: c + "-trees-tree-title" });
            WH.ae(m.elements.container, o);
            H.treeTitles.push(o);
            let r = H.treeData[m.treeId];
            if (H.iframeEmbed) {
                if (!a) {
                    WH.ae(o, WH.ce("img", { src: l.getIconUrl(s.getIconName(e)), className: `${c}-trees-tree-title-icon` }));
                    WH.ae(o, WH.ce("img", { src: l.getIconUrl(i.getIconName(n)), className: `${c}-trees-tree-title-icon` }));
                    WH.ae(o, WH.ce("div", { className: `${c}-trees-tree-title-name` }, WH.ct(WH.term("specclass_format", i.getName(n), s.getName(e)))));
                }
            } else {
                let t = a ? i.getIconName(n) : s.getIconName(e);
                let d = WH.ce("img", { src: l.getIconUrl(t), className: `${c}-trees-tree-title-icon` });
                WH.ae(o, d);
                let u = WH.ce("div", { className: `${c}-trees-tree-title-name` }, WH.ct(WH.term("tree_format", i.getName(r.id) || s.getName(r.id))));
                WH.ae(o, u);
            }
            m.elements.subtitle = WH.ce("div", { className: c + "-trees-tree-subtitle" });
            WH.ae(o, m.elements.subtitle);
            m.elements.subtitle.classList.add(`c${e}`);
            if (!H.iframeEmbed || a) {
                if (H.embedded) {
                    E(o);
                }
                m.elements.openCalcButton = WH.createButton("", "javascript:");
                WH.st(m.elements.openCalcButton, WH.term("openInTool_format", WH.TERMS.calculator_tool));
                m.elements.openCalcButton.classList.add(`${c}-trees-tree-title-open`);
                WH.ae(o, m.elements.openCalcButton);
                if (H.iframeEmbed) {
                    WH.st(m.elements.openCalcButton, WH.TERMS.talentcalculator);
                }
                WH.aE(t, t.EVENT_HASH_UPDATE, (e) => (m.elements.openCalcButton.href = e.detail));
                WH.aE(m.elements.openCalcButton, "click", (e) => {
                    if (m.annotating) {
                        e.preventDefault();
                        let t = m.elements.openCalcButton.href;
                        let a = t.replace(/(\/talent-calc\/\w+\/\w+)\/[^#]*/, "$1");
                        Menu.show([Menu.createItem({ label: WH.TERMS.spendPoints, url: a, options: { fontIcon: "adjust" } }), Menu.createItem({ label: WH.TERMS.annotate, url: t, options: { fontIcon: "flag" } })], m.elements.openCalcButton);
                    }
                });
            }
        }
        function B(e) {
            let t = WH.ce("div", { className: c + "-tree" });
            WH.ae(m.elements.container, t);
            if (!WH.Device.isTouch()) {
                WH.aE(document, "keydown", (e) => {
                    if (e.key === "Shift") {
                        t.dataset.text = 1;
                    }
                });
                WH.aE(document, "keyup", (e) => {
                    if (e.key === "Shift") {
                        delete t.dataset.text;
                    }
                });
            }
            let a = WH.ce("div", { className: c + "-tree-space" });
            WH.ae(t, a);
            let n = (m.elements.grid = WH.ce("div", { className: c + "-tree-grid" }));
            WH.ae(a, n);
            m.checkpoints.forEach((t) => {
                let n = WH.ce("div", { className: c + "-tree-checkpoint", style: { top: (100 * (t.row - 1)) / u + "%" } });
                if (e) {
                    n.classList.add(`c${e}`);
                }
                WH.ae(n, WH.ce("div", { className: `${c}-tree-checkpoint-line` }));
                WH.ae(n, WH.ct(WH.term("required_format", t.points)));
                WH.ae(n, WH.ce("div", { className: `${c}-tree-checkpoint-line` }));
                WH.ae(a, n);
            });
            let l;
            let s = () =>
                (l =
                    l ||
                    requestAnimationFrame(() => {
                        l = null;
                        a.style.fontSize = Math.max(9, a.clientWidth / 50) + "px";
                        let e = a.clientWidth / 15;
                        if (e < 25) {
                            a.dataset.noPointsMargin = 1;
                        } else {
                            delete a.dataset.noPointsMargin;
                        }
                    }));
            s();
            if (window.ResizeObserver) {
                new ResizeObserver(s).observe(a);
            }
        }
        function _(e) {
            if (P()) {
                return true;
            }
            let t = m.talents[e].requires;
            if (t.length && !t.some((e) => M(e) >= y(e))) {
                return false;
            }
            if (m.talents[e].requiredPoints != null) {
                if (m.talents[e].requiredPoints > I($(e).row)) {
                    return false;
                }
            } else {
                let t = $(e).row;
                if (m.checkpoints.some((e) => e.row <= t && e.points > I(e.row))) {
                    return false;
                }
            }
            if (M(e) === 0 && y(e) > 0) {
                if (!H.editable) {
                    return false;
                }
                let e = k();
                if (e >= m.maxPoints) {
                    return false;
                }
            }
            return true;
        }
        function q(e, a, n, l, s) {
            if (H.iframeEmbed && !H.editable) {
                return;
            }
            if (s) {
                s.preventDefault();
            }
            if (!H.editable) {
                return;
            }
            if (l && t.isTouch() && a == null && s && s.target && s.target.dataset.showingTouchTooltip !== "true") {
                l();
                s.target.dataset.showingTouchTooltip = "true";
                return;
            }
            if (!_(e)) {
                return;
            }
            let i = m.annotating ? m.annotatedChoices : m.choices;
            if (a != null) {
                i[e] = a;
            }
            let o = n != null || !s || s.type === "click";
            if (m.annotating) {
                if (!o) {
                    delete m.annotatedChoices[e];
                    b(e, null);
                } else if (a == null) {
                    Menu.show(N(e, false), WH.qs(`.${c}-tree-talent[data-cell="${e}"]`, m.elements.grid));
                    return;
                } else {
                    A();
                    S();
                }
                return;
            }
            let r = M(e);
            let d;
            if (o) {
                if (n == null) {
                    n = r + 1;
                }
                d = Math.min(n, y(e), r + m.maxPoints - k());
            } else {
                if (n == null) {
                    n = r - 1;
                }
                d = Math.max(n, 0);
            }
            if (d !== r) {
                if (d > 0) {
                    m.points[e] = d;
                } else {
                    delete m.points[e];
                    delete m.choices[e];
                }
            }
            A();
            S();
            if (!t.isTouch() && l) {
                WH.Tooltip.hide();
                l();
            }
        }
        function A() {
            let e = Object.values(m.talents)
                .map((e) => e.cell)
                .sort((e, t) => e - t);
            while (
                e.some((e) => {
                    let t = M(e);
                    let a = y(e);
                    let l = WH.qs(`.${c}-tree-talent-points[data-cell="${e}"]`, m.elements.grid);
                    if (a > 0) {
                        WH.st(l, t + "/" + a);
                    } else {
                        WH.ee(l);
                    }
                    if (t) {
                        l.dataset.points = t;
                    } else {
                        delete l.dataset.points;
                        if (P() && a > 0) {
                            l.dataset.points = 0;
                            WH.st(l, a);
                        }
                    }
                    let s = WH.qs(`.${c}-tree-talent[data-cell="${e}"]`, m.elements.grid);
                    let i = WH.qs(`.${c}-tree-talent-boundary-frame`, s);
                    let r = _(e);
                    delete s.dataset.available;
                    delete s.dataset.annotated;
                    s.style.setProperty("--border-color", "");
                    i.style.filter = "";
                    if (r) {
                        if (m.annotating) {
                            if (m.annotatedCells[e]) {
                                let t = n.find((t) => t.id === m.annotatedCells[e]) || n[0];
                                s.dataset.annotated = 1;
                                s.style.setProperty("--border-color", t.color);
                                i.style.filter = o.sprintf(f, ...t.color.match(/[0-9a-f]{2}/gi).map((e) => parseInt(e, 16) / 255));
                            }
                        } else {
                            s.dataset.available = 1;
                        }
                        if (t >= a) {
                            s.dataset.full = 1;
                        } else {
                            delete s.dataset.full;
                        }
                    } else {
                        delete s.dataset.full;
                        if (t > 0) {
                            delete m.points[e];
                            delete m.choices[e];
                            return true;
                        }
                    }
                    let d = m.annotating ? m.annotatedChoices : m.choices;
                    delete s.dataset.choiceBackground;
                    if (d[e] != null) {
                        s.dataset.choiceBackground = d[e];
                        s.href = s.dataset["choiceHref" + d[e]];
                    } else if (s.dataset.talentType == h) {
                        s.href = "javascript:";
                    }
                    if (m.talents[e].spells[d[e] || 0].hasRankDescription) {
                        s.href = WH.Url.addGet(s.href, "rank", t || 1);
                    }
                    m.talents[e].requires.forEach((t) => {
                        let a = `.${c}-tree-connection` + `[data-from-cell="${t}"][data-to-cell="${e}"]`;
                        let l = WH.qs(a, m.elements.grid.parentNode);
                        if (r && M(t) >= y(t)) {
                            l.dataset.available = 1;
                        } else {
                            delete l.dataset.available;
                        }
                        let s = m.annotating ? m.annotatedConnections[l.dataset.index] : null;
                        if (s) {
                            let e = n.find((e) => e.id === s) || n[0];
                            l.dataset.annotated = 1;
                            WH.qsa("*", l).forEach((t) => (t.style.filter = o.sprintf(f, ...e.color.match(/[0-9a-f]{2}/gi).map((e) => parseInt(e, 16) / 255))));
                        } else {
                            delete l.dataset.annotated;
                            WH.qsa("*", l).forEach((e) => (e.style.filter = ""));
                        }
                    });
                })
            );
            if (k() >= m.maxPoints) {
                m.elements.grid.dataset.fullySpent = 1;
            } else {
                delete m.elements.grid.dataset.fullySpent;
            }
            if (!H.editable) {
                m.elements.grid.dataset.readOnly = 1;
            }
            U();
        }
        function P() {
            return m.annotating || (!H.editable && !H.iframeEmbed && !Object.keys(m.points).length);
        }
        function D(e, t, a) {
            let n = WH.ce("div", { innerHTML: a });
            let l = WH.qs(":scope > table:nth-child(2)", n);
            if (!l) {
                return a;
            }
            let s = m.talents[e.dataset.cell];
            for (let a, i = 0; (a = s.spells[i]); i++) {
                let s = WH.Entity.getUrl(WH.Types.SPELL, a.spell, a.spellName || a.name, undefined, H.dataEnv);
                if (e.href !== s && i !== t) {
                    continue;
                }
                if (a.spellName) {
                    let e = WH.qs("b.whtt-name", n);
                    if (e) {
                        WH.ee(e);
                        WH.st(e, a.name);
                    }
                }
                if (a.description) {
                    let e = WH.qs("td", l);
                    if (e) {
                        WH.ee(e);
                        WH.ae(e, WH.ce("div", { className: "q" }, o.renderBlizzardUiEscapedString(a.description)));
                    }
                }
                return n.innerHTML;
            }
            return a;
        }
        function U() {
            let e = k();
            WH.ee(m.elements.subtitle);
            let t = WH.ce("span", {}, WH.ct(WH.TERMS.pointsSpent_colon));
            WH.ae(m.elements.subtitle, t);
            WH.ae(t, WH.ce("span", { className: `${c}-trees-tree-subtitle-value` }, WH.ct(e + o.nbsp + "/" + o.nbsp + m.maxPoints)));
            let a = m.requiredLevelBase + (e > 0 ? (e - 1) * 2 : 0);
            let n = WH.ce("span", {}, WH.ct(WH.TERMS.requiredLevel + WH.TERMS.colon_punct));
            WH.ae(m.elements.subtitle, n);
            WH.ae(n, WH.ce("span", { className: `${c}-trees-tree-subtitle-value` }, WH.ct(a)));
            if (P()) {
                WH.ee(m.elements.subtitle);
            }
            WH.qsa(`.${c}-trees-tree-subtitle-lower`, m.elements.container).forEach((e) => e.parentNode.removeChild(e));
            let l = m.elements.subtitle.cloneNode(true);
            l.classList.add(`${c}-trees-tree-subtitle-lower`);
            WH.ae(m.elements.container, l);
        }
        R.apply(this, arguments);
    };
    S.apply(this, arguments);
};
WH.Wow.TalentCalcDragonflight.isReady = function (e) {
    return !!WH.getPageData(WH.Strings.sprintf("wow.talentCalcDragonflight.%s.trees", WH.getDataEnvKey(e)));
};
