"use client";
import Link from "next/link";
import { chunk } from "lodash";
import { Utils } from "@/utils";
import { Constants } from "@/constants";
import { useEffect, useState } from "react";
import { axios } from "@/api/core/axios";

export default function MainNav() {
  const [tagsData, setTagsData] = useState<Array<{ id: string; name: string; description: string }>>([]);
  useEffect(() => {
    let mounted = true;
    axios({ method: "GET", url: "/api/series/tags" })
      .then((res) => {
        if (mounted) setTagsData(res.data?.data || []);
      })
      .catch(() => {});
    return () => {
      mounted = false;
    };
  }, []);
  return (
    <div className="Module Module-144">
      <div className="ModuleContent">
        <ul className="nav navbar-nav main-menu">
          <li>
            <Link target="_self" href={Constants.Routes.nettrom.index}>
              <i className="fa fa-home hidden-xs"></i>
              <span className="visible-xs">Trang chủ</span>
            </Link>
          </li>
          <li>
            <Link target="_self" href={Constants.Routes.nettrom.following}>
              Theo dõi
            </Link>
          </li>
          <li>
            <Link
              target="_self"
              href={`${Constants.Routes.nettrom.search}?order[followedCount]=desc#results`}
            >
              Hot
            </Link>
          </li>
          <li>
            <Link
              target="_self"
              href={`${Constants.Routes.nettrom.search}?order[rating]=desc#results`}
            >
              Yêu thích
            </Link>
          </li>
          <li>
            <Link
              target="_self"
              href={`${Constants.Routes.nettrom.search}?order[createdAt]=desc#results`}
            >
              Mới cập nhật
            </Link>
          </li>
          <li>
            <Link target="_self" href={Constants.Routes.nettrom.history}>
              Lịch sử
            </Link>
          </li>
          <li className="dropdown hidden md:block">
            <Link
              className="dropdown-toggle"
              data-toggle="dropdown"
              role="button"
              aria-expanded="false"
              target="_self"
              href={Constants.Routes.nettrom.search}
            >
              Thể loại <i className="fa fa-caret-down"></i>
            </Link>
            <ul className="dropdown-menu megamenu">
              <li>
                <div className="clearfix">
                  {chunk((tagsData || []).map((t) => ({
                    id: t.id,
                    attributes: {
                      name: { vi: t.name },
                      description: { vi: t.description },
                    }
                  })), 13).map((col, idx) => (
                    <div className="col-sm-3" key={col[0]?.id || idx}>
                      <ul className="nav">
                        {col.map((tag) => (
                          <li key={tag.id}>
                            <Link
                              title={Utils.Mangadex.transLocalizedStr(
                                tag.attributes.description,
                              )}
                              data-title={Utils.Mangadex.transLocalizedStr(
                                tag.attributes.description,
                              )}
                              href={`${Constants.Routes.nettrom.search}?includedTags=${tag.id}#results`}
                            >
                              {Utils.Mangadex.transLocalizedStr(
                                tag.attributes.name,
                              )}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                  <div className="col-sm-12 hidden-xs">
                    <p className="tip"></p>
                  </div>
                </div>
              </li>
            </ul>
          </li>
          <li>
            <Link target="_self" href={Constants.Routes.nettrom.search}>
              Tìm truyện
            </Link>
          </li>
          <li>
            <Link
              target="_self"
              href={`${Constants.Routes.nettrom.search}?publicationDemographic=josei&publicationDemographic=shoujo#results`}
            >
              Con gái
            </Link>
          </li>
          <li>
            <Link
              target="_self"
              href={`${Constants.Routes.nettrom.search}?publicationDemographic=seinen&publicationDemographic=shounen#results`}
            >
              Con trai
            </Link>
          </li>
          <li>
            <Link target="_blank" href={Constants.Routes.hako}>
              Light Novel
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
}
